import express from 'express';
import {societyDocumentController} from './document.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/society', societyDocumentController.createSocietyDocument);
router.get('/society', societyDocumentController.getSocietyDocuments);
router.delete('/:id', societyDocumentController.deleteDocument);

export default router;