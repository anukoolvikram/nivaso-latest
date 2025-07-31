import express from 'express';
import { complaintController } from './complaint.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/post', complaintController.createComplaint);
router.get('/society/get', complaintController.getComplaintsInSociety);
router.get('/resident', complaintController.getResidentComplaints);
router.put('/status/:id', complaintController.updateStatus);
router.post('/add-response', complaintController.submitResponse);

export default router;