import express from 'express';
import { residentController } from './resident.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js'; 

const router = express.Router();
router.use(authMiddleware);

router.get('/profile/get', residentController.getProfile);
router.put('/profile/update', residentController.updateProfile);
router.put('/profile/password', residentController.changePassword);

export default router;