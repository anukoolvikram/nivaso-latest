export const formatPrismaPollOptions = (options = []) => {
  return {
    create: options.map((text) => ({ option_text: text })),
  };
};

export const formatPrismaAttachments = (imageUrls = []) => {
  return {
    create: imageUrls.map((imageUrl) => ({
      file_path: typeof imageUrl === 'string' ? imageUrl : imageUrl.file_path,
      original_name: 'image.jpg', 
      mime_type: 'image/jpeg',   
      owner_type: 'notice',
    })),
  };
};

export const buildNoticeWhereClause = async (user, prisma) => {
  const { userId, role } = user;
  switch (role) {
    case 'federation':
      return { author_type: 'federation', author_id: userId };

    case 'society': {
      const societyAdmin = await prisma.society.findUniqueOrThrow({
        where: { id: userId },
        include: { federation: true },
      });
      const conditions = [{ society_code: societyAdmin.society_code }];
      if (societyAdmin.federation) {
        conditions.push({
          author_type: 'federation',
          author_id: societyAdmin.federation.id,
          society_code: null,
        });
      }
      return { OR: conditions };
    }

    case 'resident': {
      const resident = await prisma.resident.findUniqueOrThrow({
        where: { id: userId },
        include: { society: true },
      });
      if (!resident.society) throw new Error('Associated society not found.');
      return {
        OR: [
          { society_code: resident.society.society_code, is_approved: true },
          { author_type: 'resident', author_id: userId },
        ],
      };
    }

    default:
      throw new Error('Invalid user type.');
  }
};

export const enrichNoticesWithAuthorInfo = async (notices, prisma) => {
  const residentAuthorIds = notices
    .filter((notice) => notice.author_type === 'resident')
    .map((notice) => notice.author_id);

  if (residentAuthorIds.length === 0) {
    return notices.map(notice => ({
        ...notice,
        author_name: notice.author_type === 'society' ? 'Society' : 'Federation',
        flat_id: null
    }));
  }

  const residents = await prisma.resident.findMany({
    where: { id: { in: residentAuthorIds } },
    select: { id: true, name: true, flat_id: true },
  });
  const residentInfoMap = new Map(residents.map((r) => [r.id, { name: r.name, flat_id: r.flat_id }]));

  return notices.map((notice) => {
    let author_name = 'Admin';
    let flat_id = null;

    if (notice.author_type === 'resident') {
      const residentInfo = residentInfoMap.get(notice.author_id);
      author_name = residentInfo?.name || 'Unknown Resident';
      flat_id = residentInfo?.flat_id || null;
    } else if (notice.author_type === 'society') {
        author_name = 'Society';
    } else if (notice.author_type === 'federation') {
        author_name = 'Federation';
    }

    return { ...notice, author_name, flat_id };
  });
};