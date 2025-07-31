import { prisma } from '../../models/db.js';

const createSocietyDocument = async (data, societyId) => {
    const { title, url } = data;
    return prisma.attachment.create({
        data: {
            original_name: title, 
            file_path: url,       
            mime_type: 'application/pdf', 
            owner_id: societyId,
            owner_type: 'society_document', 
        },
    });
};

const getDocumentsBySociety = async (societyId) => {
    return prisma.attachment.findMany({
        where: {
            owner_id: societyId,
            owner_type: 'society_document',
        },
        orderBy: {
            created_at: 'desc',
        },
    });
};

const deleteDocument = async (documentId) => {
    const document = await prisma.attachment.findFirstOrThrow({
        where: { id: documentId, owner_type: 'society_document' }
    });
    return prisma.attachment.delete({
        where: { id: document.id },
    });
};

export const societyDocumentService = {
    createSocietyDocument,
    getDocumentsBySociety,
    deleteDocument,
};