import { residentService } from './resident.service.js';

const getProfile = async (req, res) => {
    try {
        const profile = await residentService.getProfileById(req.user.userId);
        res.status(200).json(profile);
    } catch (error) {
        console.error('Failed to fetch profile', error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const residentId = req.user.userId;        
        await residentService.updateProfile(residentId, req.body);
        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
        console.error('Failed to update profile', error.message);
        // Handle cases where the new email might already be taken
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'This email address is already in use.' });
        }
        res.status(500).json({ error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        await residentService.changePassword(req.user.userId, req.body);
        res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Failed to change password', error.message);
        // Handle specific, known errors from the service layer
        if (error.message === 'Incorrect old password.') {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === 'User not found.') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};

export const residentController = {
    getProfile,
    updateProfile,
    changePassword,
};