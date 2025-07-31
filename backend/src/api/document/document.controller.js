import { societyDocumentService } from './document.service.js';

const createSocietyDocument = async (req, res) => {
    try {
        const document = await societyDocumentService.createSocietyDocument(req.body, req.user.userId);
        res.status(201).json(document);
    } catch (error) {
        console.error('Failed to create document.', error.message);
        res.status(500).json({ error: error.message });  
    }
};

const getSocietyDocuments = async (req, res) => {
    try {
        const documents = await societyDocumentService.getDocumentsBySociety(req.user.userId);
        res.status(200).json(documents);
    } catch (error) {
        console.error('Failed to fetch document.', error.message);
        res.status(500).json({ error: error.message }); 
    }
};

const deleteDocument = async (req, res) => {
    try {
        const documentId = parseInt(req.params.id, 10);
        await societyDocumentService.deleteDocument(documentId);
        res.status(200).json({ message: 'Document deleted successfully.' });
    } catch (error) {
        console.error('Failed to delete document.', error.message);
        // Prisma's P2025 error code means "Record to delete not found."
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Document not found.' });
        }
        res.status(500).json({ error: error.message }); 
    }
};

export const societyDocumentController = {
    createSocietyDocument,
    getSocietyDocuments,
    deleteDocument,
};