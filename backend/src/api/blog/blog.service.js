import prisma from '../../models/db.js';
import {
  formatPrismaTags,
  formatPrismaAttachments,
  hydrateBlogAuthors,
} from '../../utils/blogUtils.js';

const createBlog = async (user, blogData) => {
  const { title, content, tags, attachments } = blogData;
  const { userId, role, society_code } = user;
  return prisma.blog.create({
    data: {
      title,
      content,
      author_id: userId,
      author_type: role,
      society_code: society_code,
      tags: formatPrismaTags(tags),
      attachments: formatPrismaAttachments(attachments),
    },
    include: {
      tags: true,
      attachments: true,
    },
  });
};

const updateBlog = async (blogId, updateData) => {
  const { title, content, tags, attachments } = updateData;
  return prisma.blog.update({
    where: { id: blogId },
    data: {
      title,
      content,
      tags: {
        set: [],
        ...formatPrismaTags(tags),
      },
      attachments: {
        deleteMany: {},
        create: attachments.map(image => typeof image === 'string' ? 
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
    },
    include: {
      tags: true,
      attachments: true,
    },
  });
};

//   console.log(blogData)
//   const { title, content, tags, existingImages = [], newImages = [] } = blogData;
//   const { userId, role, society_code } = user;
//   let uploadedImages = [];
//   if (newImages.length > 0) {
//       uploadedImages = await Promise.all(newImages.map(uploadImageToCloudinary));
//   }

//   return prisma.blog.create({
//       data: {
//           title,
//           content,
//           author_id: userId,
//           author_type: role,
//           society_code: society_code,
//           tags: formatPrismaTags(tags),
//           attachments: formatPrismaAttachments([...existingImages, ...uploadedImages]),
//       },
//       include: {
//           tags: true,
//           attachments: true,
//       },
//   });
// };

// const updateBlog = async (blogId, updateData) => {
//   console.log(blogData)
//   const { title, content, tags, existingImages = [], newImages = [] } = updateData;
//   let uploadedImages = [];
//   if (newImages.length > 0) {
//       uploadedImages = await Promise.all(newImages.map(uploadImageToCloudinary));
//   }

//   return prisma.blog.update({
//       where: { id: blogId },
//       data: {
//           title,
//           content,
//           tags: {
//               set: [],
//               ...formatPrismaTags(tags),
//           },
//           attachments: {
//               deleteMany: {},
//               ...formatPrismaAttachments([...existingImages, ...uploadedImages]),
//           },
//       },
//       include: {
//           tags: true,
//           attachments: true,
//       },
//   });
// };

const deleteBlog = async (blogId) => {
  return prisma.blog.delete({
    where: { id: blogId },
  });
};

const getBlogsBySociety = async (user) => {
  const blogs = await prisma.blog.findMany({
    where: { society_code: user.society_code },
    orderBy: { created_at: 'desc' },
    include: {
      tags: { select: { name: true } },
      attachments: { select: { file_path: true, original_name: true } },
    },
  });
  return hydrateBlogAuthors(blogs, prisma);
};

const getBlogsByResident = async (authorId) => {
  const blogs = await prisma.blog.findMany({
    where: {
      author_id: authorId,
      author_type: 'resident',
    },
    orderBy: { created_at: 'desc' },
    include: {
      tags: { select: { name: true } },
      attachments: { select: { file_path: true, original_name: true } },
    },
  });

  const authorDetails = await prisma.resident.findUnique({
    where: { id: authorId },
    select: {
      name: true,
      flat_id: true,
    },
  });

  return blogs.map((blog) => ({
    ...blog,
    author: authorDetails || null,
  }));
};

export const blogService = {
  createBlog,
  getBlogsBySociety,
  getBlogsByResident,
  updateBlog,
  deleteBlog,
};