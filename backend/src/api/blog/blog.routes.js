import express from 'express';
import { blogController } from './blog.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/create', blogController.createBlog);
router.put('/update/:id', blogController.updateBlog);
router.delete('/delete/:id', blogController.deleteBlog);
router.get('/society/get', blogController.getBlogsForSociety);
router.get('/resident/get', blogController.getBlogsByResident);

export default router;