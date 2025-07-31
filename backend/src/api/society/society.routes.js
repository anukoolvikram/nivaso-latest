import express from 'express';
import { societyController } from './society.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js'; 

const router = express.Router();
router.use(authMiddleware)

// router.post('/setup', societyController.setupSociety);
router.get('/flats/get', societyController.getFlats);
router.post('/flats/update/:id', societyController.saveFlat);
router.post('/flats/create', societyController.createFlat);
router.get('/details', societyController.getSocietyDetails);

router.post('/flat/document', societyController.createDocument);
router.get('/flat/document/:flatId', societyController.getFlatDocuments);
router.delete('/flat/document/:id', societyController.deleteDocument);

export default router;