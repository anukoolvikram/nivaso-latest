import apiClient from './apiClient';

export const createNotice = (payload) => {
  return apiClient.post('/notice/create', payload);
};

export const updateNotice = (noticeId, payload) => {
  return apiClient.put(`/notice/update/${noticeId}`, payload);
};
