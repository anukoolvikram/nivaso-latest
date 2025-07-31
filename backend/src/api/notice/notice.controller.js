import { noticeService } from './notice.service.js';

const createNotice = async (req, res) => {
  try {
    const notice = await noticeService.createNotice(req.body, req.user);
    res.status(201).json(notice);
  } catch (error) {
    console.error('Failed to create notice:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getNoticesForUser = async (req, res) => {
  try {
    const notices = await noticeService.getNoticesForUser(req.user);
    res.status(200).json(notices);
  } catch (error) {
    console.error('Failed to get notices for a user', error.message);
    if (error.message.includes('not found')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes('Invalid user type')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getNoticeUsingId = async (req, res) => {
  try {
    const noticeId=parseInt(req.params.id);
    const notice = await noticeService.getNoticesUsingId(noticeId);
    res.status(200).json(notice);
  } catch (error) {
    console.error('Failed to get the notice', error.message);
    if (error.message.includes('not found')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes('Invalid user type')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const getNoticesForSociety = async (req, res) => {
  try {
    const { societyCode } = req.params;
    const notices = await noticeService.getNoticesForSociety(societyCode);
    res.status(200).json(notices);
  } catch (error) {
    console.error('Failed to get notices for a society:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const castVote = async (req, res) => {
  try {
    const {optionId, noticeId}=req.body;
    const response=await noticeService.castVote(optionId, req.user.userId, noticeId);
    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to cast the vote', error.message);
    // Prisma's unique constraint violation for voting again
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'You have already voted in this poll.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const approveNotice = async (req, res) => {
  try {
    const noticeId = parseInt(req.params.id, 10);
    const notice = await noticeService.approveNotice(noticeId);
    res.status(200).json({ message: 'Notice approved successfully.', notice });
  } catch (error) {
    console.error('Failed to approve notice', error.message);
    if (error.code === 'P2025') { // Prisma's "Record Not Found" error
      return res.status(404).json({ error: 'Notice not found.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const noticeId = parseInt(req.params.id, 10);
    await noticeService.deleteNotice(noticeId);
    res.status(200).json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete notice', error.message);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const updatedNotice = await noticeService.updateNotice(noticeId, req.body, req.user);
    res.status(200).json(updatedNotice);
  } catch (error) {
    console.error('Failed to update notice:', error.message);
    if (error.message.includes('Not Found')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.message.includes('Forbidden')) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const noticeController = {
  createNotice,
  getNoticesForUser,
  getNoticeUsingId,
  getNoticesForSociety,
  castVote,
  approveNotice,
  deleteNotice,
  updateNotice
};