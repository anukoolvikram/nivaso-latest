export const formatPrismaTags = (tags = []) => {
  return {
    connectOrCreate: tags.map((name) => ({
      where: { name },
      create: { name },
    })),
  };
};

// export const formatPrismaAttachments = (attachmentUrls = []) => {
//   return {
//     create: attachmentUrls.map((url) => ({
//       file_path: url,
//       original_name: 'image.jpg', 
//       mime_type: 'image/jpeg',   
//       owner_type: 'blog',
//     })),
//   };
// };
export const formatPrismaAttachments = (imageUrls = []) => {
  return {
      create: imageUrls.map((imageUrl) => ({
          file_path: imageUrl,
          original_name: 'image.jpg', 
          mime_type: 'image/jpeg',
          owner_type: 'blog',
      })),
  };
};

export const hydrateBlogAuthors = async (blogs, prisma) => {
  const residentAuthorIds = blogs
    .filter((blog) => blog.author_type === 'resident')
    .map((blog) => blog.author_id);

  let residentNameMap = new Map();
  if (residentAuthorIds.length > 0) {
    const residents = await prisma.resident.findMany({
      where: { id: { in: residentAuthorIds } },
      select: { id: true, name: true },
    });
    residentNameMap = new Map(residents.map((r) => [r.id, r.name]));
  }

  return blogs.map((blog) => {
    let authorName = 'Unknown';
    if (blog.author_type === 'resident') {
      authorName = residentNameMap.get(blog.author_id) || 'Unknown Resident';
    } else if (blog.author_type === 'society') {
      authorName = 'Committee Member';
    }
    return {
      ...blog,
      authorName,
    };
  });
};