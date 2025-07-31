import express from 'express';
import { noticeController } from './notice.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/get', noticeController.getNoticesForUser);
router.get('/get/:id', noticeController.getNoticeUsingId);
router.post('/create', noticeController.createNotice);
router.put('/update/:id', noticeController.updateNotice);
router.get('/society/:societyCode', noticeController.getNoticesForSociety);
router.post('/vote', noticeController.castVote);
router.put('/approve/:id', noticeController.approveNotice);
router.delete('/delete/:id', noticeController.deleteNotice);

export default router;