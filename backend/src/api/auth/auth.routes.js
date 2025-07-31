import express from 'express';
import { authController } from './auth.controller.js';
const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/user-info',authController.getUserInfo);
router.post('/self-register', authController.createSociety); //Society Reg without Federation Code

export default router;