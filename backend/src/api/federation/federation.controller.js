import { federationService } from './federation.service.js';

const getSocietiesByFederation = async (req, res) => {
  try {
    const societies = await federationService.getSocietiesByFederation(req.user);
    res.status(200).json(societies);
  } catch (error) {
    console.error('Failed to fetch societies of federation', error.message);
    res.status(500).json({ error: error.message });  
  }
};

const updateSociety = async (req, res) => {
  try {
    const { societyCode } = req.params;
    const updatedSociety = await federationService.updateSociety(societyCode, req.body);
    res.status(200).json(updatedSociety);
  } catch (error) {
    console.error('Failed to update society', error.message);
    // Prisma's update throws a specific error if the record to update is not found
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Society not found.' });
    }
    res.status(500).json({ error: error.message });  
  }
};

const addSociety = async (req, res) => {
  try {
    const newSociety = await federationService.addSociety(req.user, req.body);
    res.status(201).json(newSociety);
  } catch (error) {
    console.error('Failed to add society', error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteSociety = async (req, res, next) => {
  try {
    const { societyCode } = req.params;
    await federationService.deleteSociety(societyCode);
    res.status(200).json({ message: 'Society deleted successfully.' });
  } catch (error) {
    console.error('Failed to delete society', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getFederationDetails = async (req, res) => {
  try {
    const federationId = parseInt(req.params.id, 10);
    const federation = await federationService.getFederationDetails(federationId);
    res.status(200).json(federation);
  } catch (error) {
    console.error('Failed to fetch federation details', error.message);
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
    try {
        const federationId = parseInt(req.params.id, 10);
        await federationService.changePassword(federationId, req.body);
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        if (error.message === 'Incorrect current password') {
            return res.status(401).json({ error: error.message });
        }
        if (error.message === 'Federation not found') {
            return res.status(404).json({ error: error.message });
        }
        console.error('Failed to change password', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const federationController = {
  getSocietiesByFederation,
  updateSociety,
  addSociety,
  deleteSociety,
  getFederationDetails,
  changePassword,
};