import apiClient from './apiClient';
import { uploadImageToCloudinary } from '../utils/uploadImages';

const getSocietyBlogs = () => {
  return apiClient.get(`/blog/society/get`);
};

const getResidentBlogs = () => {
  return apiClient.get(`/blog/resident/get`);
};

const createBlog = async (blogData) => {
  const { title, content, tags, existingImages = [], newImages = [] } = blogData;
  const uploadedImages = await Promise.all(newImages.map(uploadImageToCloudinary));
  const payload = {
      title,
      content,
      tags,
      attachments: [...existingImages, ...uploadedImages]
  };
  return apiClient.post(`/blog/create`, payload);
};

const updateBlog = async (blogId, blogData) => {
  const { title, content, tags, existingImages = [], newImages = [] } = blogData;
  let uploadedImages = [];
  if (newImages.length > 0) {
      uploadedImages = await Promise.all(newImages.map(uploadImageToCloudinary));
  }
  const payload = {
      title,
      content,
      tags,
      attachments: [...existingImages, ...uploadedImages]
  };
  return apiClient.put(`/blog/update/${blogId}`, payload);
};

const deleteBlog = (blogId) => {
  return apiClient.delete(`/blog/delete/${blogId}`);
};

export const blogService = {
  getSocietyBlogs,
  getResidentBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};