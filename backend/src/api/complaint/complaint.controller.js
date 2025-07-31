import { complaintService } from './complaint.service.js';

const createComplaint = async (req, res) => {
    try {
        const complaint = await complaintService.createComplaint(req.body, req.user);
        res.status(201).json(complaint);
    } catch (error) {
        console.error('Failed to create complaint', error.message);
        res.status(500).json({ error: error.message });  
    }
};

const getComplaintsInSociety = async (req, res) => {
    try {
        const complaints = await complaintService.getComplaintsBySociety(req.user);
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Failed to fetch complaints for the society', error.message);
        res.status(500).json({ error: error.message });  
    }
};

const getResidentComplaints = async (req, res) => {
    try {
        const complaints = await complaintService.getComplaintsByResident(req.user.userId);
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Failed to fetch complaints for the resident', error.message);
        res.status(500).json({ error: error.message });  
    }
};

const updateStatus = async (req, res) => {
    try {
        const complaintId = parseInt(req.params.id, 10);
        const updatedComplaint = await complaintService.updateComplaintStatus(complaintId, req.body);
        res.status(200).json(updatedComplaint);
    } catch (error) {
        console.error('Failed to update the status of the complaint', error.message);
        // Prisma's error code for a record not found during an update
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Complaint not found.' });
        }
        res.status(500).json({ error: error.message });  
    }
};

const submitResponse = async (req, res) => {
  try {
    const updatedComplaint = await complaintService.addResidentResponse(req.user.userId, req.body);
    res.status(201).json(updatedComplaint);
  } catch (error) {
    console.error('Error submitting complaint response:', error);
    if (error.message.includes('not found or you do not have permission')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const complaintController = {
    createComplaint,
    getComplaintsInSociety,
    getResidentComplaints,
    updateStatus,
    submitResponse
};