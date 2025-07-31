import { societyService } from './society.service.js';

// const setupSociety = async (req, res) => {
//     try {
//         const result = await societyService.setupPreRegisteredSociety(req.body);
//         res.status(201).json(result);
//     } catch (error) {
//         // Send a 400 Bad Request for known errors, 500 for everything else
//         res.status(error.message.includes("Invalid") || error.message.includes("registered") ? 400 : 500)
//            .json({ error: error.message });
//     }
// };

const getFlats = async (req, res) => {
    try {
        const user=req.user;
        const flats = await societyService.getFlatsWithDetails(user);
        res.status(200).json(flats);
    } catch (error) {
        console.error('Failed to fetch flat data.', error.message);
        res.status(500).json({ error: error.message });
    }
};

const saveFlat = async (req, res) => {
    try {
        const user=req.user;
        const id=req.params.id;
        const updatedFlat = await societyService.saveFlatData(user, id, req.body);
        res.status(200).json({ message: "Flat data saved successfully.", flat: updatedFlat });
    } catch (error) {
        console.log(error)
        // Prisma's unique constraint violation has a specific code
        if (error.code === 'P2002') {
            return res.status(409).json({ error: `The email '${error.meta.target.includes('email') ? req.body[error.meta.target.includes('owner') ? 'owner_email' : 'resident_email'] : ''}' already exists.` });
        }
        res.status(500).json({ error: "Failed to save flat data." , message: error.message});
    }
};

const getSocietyDetails = async (req, res, next) => {
    try {
        const user=req.user;
        const society = await societyService.getSocietyById(user);
        res.status(200).json(society);
    } catch (error) {
        next(error);
    }
};


const createFlat = async (req, res) => {
  try {
    const user=req.user;
    const newFlat = await societyService.createFlat(user, req.body);
    res.status(201).json({
      message: 'Flat created successfully!',
      data: newFlat,
    });
  } catch (error) {
    console.error('Error creating flat.', error.message);
    res.status(400).json({ error: error.message });
  }
};



const createDocument = async (req, res) => {
  try {
    const newDocument = await societyService.createFlatDocument(req.user, req.body);
    res.status(201).json({
      message: 'Document uploaded successfully!',
      data: newDocument,
    });
  } catch (error) {
    const statusCode = error.message.includes('access denied') ? 403 : 400;
    console.error('Failed to upload document.', error.message);
    res.status(statusCode).json({ error: error.message });
  }
};


const getFlatDocuments = async (req, res) => {
  try {
    const flatId = parseInt(req.params.flatId, 10);
    if (isNaN(flatId)) {
      return res.status(400).json({ message: 'Invalid Flat ID.' });
    }
    const documents = await societyService.getDocumentsForFlat(req.user, flatId);
    res.status(200).json({
      message: 'Documents retrieved successfully.',
      data: documents,
    });
  } catch (error) {
    const statusCode = error.message.includes('access denied') ? 403 : 404;
    console.error('Failed to retrieve documents.', error.message);
    res.status(statusCode).json({ error: error.message });
  }
};


const deleteDocument = async (req, res) => {
  try {
    const documentId = parseInt(req.params.id, 10);
    if (isNaN(documentId)) {
      return res.status(400).json({ message: 'Invalid document ID.' });
    }
    await societyService.deleteFlatDocument(req.user, documentId);
    res.status(200).json({
      message: 'Document deleted successfully.',
    });
  } catch (error) {
    const statusCode = error.message.includes('access denied') ? 403 : 404;
    console.error('Failed to delete documents.', error.message);
    res.status(statusCode).json({ error: error.message });
    
  }
};


export const societyController = {
    // setupSociety,
    getFlats,
    saveFlat,
    getSocietyDetails,
    createFlat,
    createDocument,
    getFlatDocuments,
    deleteDocument
};