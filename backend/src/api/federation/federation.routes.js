import { Router } from 'express';
import { federationController } from './federation.controller.js';
import {authMiddleware} from '../../middleware/authMiddleware.js'

const router = Router();

router.get('/get/society', authMiddleware, federationController.getSocietiesByFederation);
router.post('/create/society', authMiddleware, federationController.addSociety);
router.put('/update/society/:societyCode', authMiddleware, federationController.updateSociety);
router.delete('/delete/society/:societyCode', authMiddleware, federationController.deleteSociety);
router.get('/details/:id', authMiddleware, federationController.getFederationDetails);
router.put('/change-password/:id', authMiddleware, federationController.changePassword);

export default router;