import prisma from '../../models/db.js';
import { generatePassword } from '../../utils/authUtils.js';
import {
    hashPassword,
    generateFlatsData,
    upsertResident,
    issueSocietyAuthToken
} from '../../utils/societyUtils.js';


// const setupPreRegisteredSociety = async (data) => {
//     const { email, password, society_code, name, wing_count, floors_per_wing, rooms_per_floor } = data;
//     return prisma.$transaction(async (tx) => {
//         const society = await tx.society.findUnique({ where: { society_code } });
//         if (!society) throw new Error('Invalid society code.');
//         if (society.email) throw new Error('Society already registered.');

//         const hashedPassword = await hashPassword(password);
//         const updatedSociety = await tx.society.update({
//             where: { society_code },
//             data: { email, password: hashedPassword, name, wing_count, floors_per_wing, rooms_per_floor },
//         });

//         const flatsToCreate = generateFlatsData({ society_code, wing_count, floors_per_wing, rooms_per_floor });
//         await tx.flat.createMany({ data: flatsToCreate, skipDuplicates: true });

//         const token = issueSocietyAuthToken(updatedSociety);
//         return {
//             message: 'Society and flats registered successfully',
//             society_code: updatedSociety.society_code,
//             total_flats: flatsToCreate.length,
//             token,
//         };
//     });
// };


const getFlatsWithDetails = async (user) => {
  return prisma.flat.findMany({
    where: { society_code: user.society_code },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          is_owner: true,
        },
      },
      resident: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          is_owner: true,
        },
      },
    },
    orderBy: {
      flat_number: 'asc',
    },
  });
};



const saveFlatData = async (user, id, flatData) => {
    return prisma.$transaction(async (tx) => {
        const { flat_number, occupancy_status, ...rest } = flatData;
        if (!flat_number || !occupancy_status) throw new Error('Missing required flat data');

        const ownerDetails = {
            id: rest.owner_id,
            name: rest.owner_name,
            email: rest.owner_email,
            phone: rest.owner_phone,
            address: rest.owner_address,
            flat_id: flat_number
        };
        const finalOwnerId = await upsertResident(tx, ownerDetails, true, user.society_code);

        let finalResidentId = null;
        if (occupancy_status === 'Rented') {
            const residentDetails = {
                id: rest.resident_id,
                name: rest.resident_name,
                email: rest.resident_email,
                phone: rest.resident_phone,
                flat_id:flat_number
            };
            finalResidentId = await upsertResident(tx, residentDetails, false, user.society_code);
        }

        return tx.flat.update({
            where: { id: parseInt(id, 10) },
            data: {
                flat_number,
                occupancy_status,
                owner_id: finalOwnerId,
                resident_id: occupancy_status === 'Owner Occupied' ? finalOwnerId : finalResidentId,
            },
            include: { owner: true, resident: true },
        });
    });
};


const getSocietyById = async (user) => {
  const societyWithFederation = await prisma.society.findUniqueOrThrow({
    where: {
      id: parseInt(user.userId, 10),
    },
    include: {
      federation: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          residents: true,
          flats: true,
        },
      },
    },
  });

  const { federation, ...societyDetails } = societyWithFederation;

  return {
    ...societyDetails, 
    federation_name: federation.name, 
  };
};


const createFlat = async (user, flatData) => {
  return prisma.$transaction(async (tx) => {
    const {
      flat_number,
      occupancy_status,
      owner_name,
      owner_email,
      owner_phone,
      resident_name,
      resident_email,
      resident_phone,
    } = flatData;

    const { society_code } = user;
    let ownerId = null;
    let residentId = null;

    // 1. Validate required data
    if (!flat_number || !occupancy_status || !owner_name || !owner_email) {
      throw new Error('Missing required data. Flat number, occupancy status, and owner details are required.');
    }

    // 2. Create the Owner
    const existingOwner = await tx.resident.findUnique({ where: { email: owner_email } });
    if (existingOwner) {
      throw new Error('An owner with this email already exists.');
    }

    const newOwner = await tx.resident.create({
      data: {
        name: owner_name,
        email: owner_email,
        phone: owner_phone,
        is_owner: true,
        society_code,
        flat_id: flat_number,
        initial_password: generatePassword(10), // Generate a random initial password
      },
    });
    ownerId = newOwner.id;

    // 3. Handle the Resident based on Occupancy Status
    if (occupancy_status === 'Owner Occupied') {
      residentId = ownerId;
    } else if (occupancy_status === 'Rented' && resident_name && resident_email) {
      if (resident_email === owner_email) {
        throw new Error('Resident email cannot be the same as owner email for rented flats.');
      }
      const existingResident = await tx.resident.findUnique({ where: { email: resident_email } });
      if (existingResident) {
        throw new Error('A resident with this email already exists.');
      }

      const newResident = await tx.resident.create({
        data: {
          name: resident_name,
          email: resident_email,
          phone: resident_phone,
          is_owner: false,
          society_code,
          flat_id:flat_number,
          initial_password: generatePassword(10),
        },
      });
      residentId = newResident.id;
    }

    // 4. Create the Flat
    const newFlat = await tx.flat.create({
      data: {
        flat_number,
        society_code,
        occupancy_status,
        owner_id: ownerId,
        resident_id: residentId,
      },
      include: {
        owner: true, // Include the full owner object in the response
        resident: true, // Include the full resident object in the response
      },
    });

    return newFlat;
  });
};


const createFlatDocument = async (user, data) => {
  const { title, url, flat_id } = data;
  const flat = await prisma.flat.findFirst({
    where: {
      id: flat_id,
      society_code: user.society_code,
    },
  });

  if (!flat) {
    throw new Error('Flat not found or access denied.');
  }

  const newDocument = await prisma.attachment.create({
    data: {
      original_name: title, 
      file_path: url,
      mime_type: 'application/pdf', 
      owner_type: 'flat', 
      flat_id: flat_id,
    },
  });
  return newDocument;
};


const getDocumentsForFlat = async (user, flatId) => {
  const flat = await prisma.flat.findFirst({
    where: {
      id: flatId,
    },
  });
  if (!flat) {
    throw new Error('Flat not found or access denied.');
  }
  const documents = await prisma.attachment.findMany({
    where: {
      flat_id: flatId,
      owner_type: 'flat',
    },
    select: {
      id: true,
      original_name: true,
      file_path: true,
      mime_type: true,
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return documents;
};


const deleteFlatDocument = async (user, documentId) => {
  const document = await prisma.attachment.findFirst({
    where: {
      id: documentId,
      owner_type: 'flat',
      flat: {
        society_code: user.society_code,
      },
    },
  });

  if (!document) {
    throw new Error('Document not found or access denied.');
  }
  return prisma.attachment.delete({
    where: {
      id: documentId,
    },
  });
};


export const societyService = {
  // setupPreRegisteredSociety,
  getFlatsWithDetails,
  saveFlatData,
  getSocietyById,
  createFlat,
  createFlatDocument,
  getDocumentsForFlat,
  deleteFlatDocument
};
