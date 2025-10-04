import { prisma } from '../../models/db.js';
import {
  formatPrismaPollOptions,
  formatPrismaAttachments,
  buildNoticeWhereClause,
  enrichNoticesWithAuthorInfo,
} from '../../utils/noticeUtils.js';

const saveDraft = async (noticeData, user) => {
  const { title, content, type, poll_options = [], images = [], id } = noticeData;
  const { userId: authorId, role, society_code } = user;


  if (id) {
    // update the draft
    return prisma.notice.update({
      where: { id: id },
      data: {
        title,
        content,
        type,
        society_code,
        poll_options: formatPrismaPollOptions(poll_options),
        attachments: formatPrismaAttachments(images),
      },
      include: { poll_options: true, attachments: true },
    });
  } else {
    // create new draft
    return prisma.notice.create({
      data: {
        title,
        content,
        type,
        author_id: authorId,
        author_type: role,
        society_code,
        status: "draft",
        is_approved: role === "society" || role === "federation",
        poll_options: formatPrismaPollOptions(poll_options),
        attachments: formatPrismaAttachments(images),
      },
      include: { poll_options: true, attachments: true },
    });
  }
};


const createNotice = async (noticeData, user) => {
  const { title, content, type, poll_options = [], images = [] } = noticeData;
  const { userId: authorId, role, society_code } = user;

  if (!title || !content) {
    throw new Error('Title and content are required.');
  }

  return prisma.notice.create({
    data: {
      title,
      content,
      type,
      author_id: authorId,
      author_type: role,
      society_code: society_code,
      is_approved: role === 'society' || role === 'federation',
      poll_options: formatPrismaPollOptions(poll_options),
      attachments: formatPrismaAttachments(images),
    },
    include: {
      poll_options: true,
      attachments: true,
    },
  });
};

const getNoticesForUser = async (user) => {
  const whereClause = await buildNoticeWhereClause(user, prisma);
  const notices = await prisma.notice.findMany({
    where: whereClause,
    orderBy: { created_at: 'desc' },
    include: {
      attachments: true,
      poll_options: { include: { _count: { select: { votes: true } } } },
    },
  });
  return enrichNoticesWithAuthorInfo(notices, prisma);
};


const getNoticesUsingId = async (noticeId) => {
  const notice = await prisma.notice.findMany({
    where: {
      id: noticeId
    },
    include: {
      attachments: true,
      poll_options: { include: { _count: { select: { votes: true } } } },
    },
  });
  return notice;
};

const updateNotice = async (noticeId, noticeData, user) => {
  const { title, content, is_approved, type, images = [], poll_options = [] } = noticeData;
  
  return prisma.notice.update({
    where: { id: parseInt(noticeId, 10) },
    data: {
      title,
      content,
      society_code: user.society_code,
      is_approved,
      author_type: user.role,
      author_id: user.userId,
      attachments: {
        deleteMany: {},
        create: images.map(image => typeof image === 'string' ? 
          {
            file_path: image,
            original_name: 'image.jpg',
            mime_type: 'image/jpeg',
            owner_type: 'notice'
          } : 
          {
            file_path: image.file_path,
            original_name: image.original_name || 'image.jpg',
            mime_type: image.mime_type || 'image/jpeg',
            owner_type: 'notice'
          }
        )
      },
      poll_options: {
        deleteMany: {},
        ...formatPrismaPollOptions(poll_options),
      },
    },
    include: { attachments: true, poll_options: true },
  });
};

const castVote = async (optionId, residentId, noticeId) => {
  try {
    return await prisma.pollVote.create({
      data: { 
        option_id:  optionId, 
        resident_id: residentId,
        notice_id:  noticeId,
       },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('You have already voted!');
    }
    throw error;
  }
};

const approveNotice = (noticeId) => prisma.notice.update({
  where: { id: noticeId },
  data: { is_approved: true },
});

const deleteNotice = (noticeId) => prisma.notice.delete({
  where: { id: noticeId },
});

const getNoticesForSociety = (societyCode) => prisma.notice.findMany({
    where: { society_code: societyCode, is_approved: true },
    orderBy: { created_at: 'desc' },
    include: {
        poll_options: true,
        attachments: true,
        tags: { select: { name: true } },
    },
});

export const noticeService = {
  saveDraft,
  createNotice,
  getNoticesForUser,
  getNoticesUsingId,
  getNoticesForSociety,
  castVote,
  approveNotice,
  deleteNotice,
  updateNotice,
};