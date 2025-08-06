import { authService } from './auth.service.js';

const registerUser = async (req, res) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in registerUser controller:', error.message);
        res.status(400).json({ 
            body: req.body,
            error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in loginUser controller:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const createSociety = async (req, res) => {
    try {
        const result = await authService.createSociety(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error in createSociety controller:', error.message);
        res.status(400).json({ error: error.message });
    }
};

const getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const userInfo = await authService.getUserInfo(token);
    return res.status(200).json(userInfo);
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ error: err.message });
  }
};

export const authController = {
    registerUser,
    loginUser,
    createSociety,
    getUserInfo
};