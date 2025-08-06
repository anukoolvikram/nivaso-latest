import prisma from '../../models/db.js';
import jwt from 'jsonwebtoken';
import {
  hashPassword,
  generateAuthToken,
  normalizeEmail,
  generateFlatsForSociety,
  validatePassword,
  generateSocietyCode,
  generateFederationCode
} from '../../utils/authUtils.js';
const SECRET_KEY = process.env.JWT_SECRET;

const registerUser = async (userData) => {
  const { userType } = userData;
  if (!userType) {
    throw new Error('UserType is required');
  }
  switch (userType) {
    case 'society':
      return await registerSociety(userData);
    case 'federation':
      return await registerFederation(userData);
    default:
      throw new Error('Invalid userType for registration');
  }
};

const loginUser = async (userData) => {
  const { userType, email, password } = userData;
  if (!userType || !email || !password) {
    throw new Error('UserType, email, and password are required');
  }

  const model = prisma[userType];
  if (!model) {
    throw new Error('Invalid userType for login');
  }
  const user = await model.findUnique({ where: { email: normalizeEmail(email) } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await validatePassword(password, { ...user, role: userType });
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateAuthToken({
    userId: user.id,
    role: userType,
    society_code: user.society_code || null,
    federation_code: user.federation_code || null,
  });
  return { message: "Login successful", token };
};

const createSociety = async (societyData) => {
  const providedFederationCode = "FED17032025"
  const {
    email,
    password,
    society_name,
    no_of_wings,
    floor_per_wing,
    rooms_per_floor,
    society_type, 
  } = societyData;

  const normalizedEmail = normalizeEmail(email);
  const hashedPassword = await hashPassword(password);
  const society_code = await generateSocietyCode();
  return await prisma.$transaction(async (tx) => {
    const existingSociety = await tx.society.findUnique({ where: { email: normalizedEmail } });
    if (existingSociety) {
      throw new Error("Email is already registered");
    }

    let newFederation = null;
    let finalFederationCode = providedFederationCode;
    let existingFederation = await tx.federation.findUnique({
      where: { federation_code: providedFederationCode }
    });

    if (!existingFederation) {
      if (!providedFederationCode) {
        finalFederationCode = await generateFederationCode();
      }

      newFederation = await tx.federation.create({
        data: {
          name: `Super Common Federation`, 
          federation_code: finalFederationCode,
          email: 'superCommonFederation@gmail.com',
          password:'@anukoolvikramnivaso9119974803'
        }
      });
      console.log(`New Federation created with code: ${newFederation.federation_code}`);
      existingFederation = newFederation;
    }
    
    const newSociety = await tx.society.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: society_name,
        wing_count: no_of_wings,
        floors_per_wing: floor_per_wing,
        rooms_per_floor,
        society_code,
        society_type,
        federation_code: existingFederation.federation_code 
      }
    });

    const flatsData = generateFlatsForSociety({ society_code, no_of_wings, floor_per_wing, rooms_per_floor });
    if (flatsData.length > 0) {
      await tx.flat.createMany({ data: flatsData });
    }

    const token = generateAuthToken({
      userId: newSociety.id,
      role: 'society',
      society_code: newSociety.society_code
    });
    return { message: "Society registration successful", token };
  });
};


const getUserInfo = (token) => {
  if (!token) throw new Error('Token is missing');
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return {
      userId: decoded.userId,
      role: decoded.role || null,
      society_code: decoded.society_code || null,
      federation_code: decoded.federation_code || null
    };
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

async function registerSociety(data) {
  const { email, password, society_code, society_name, no_of_wings, floor_per_wing, rooms_per_floor } = data;
  const normalizedEmail = normalizeEmail(email);

  return prisma.$transaction(async (tx) => {
    const society = await tx.society.findUnique({ where: { society_code } });
    if (!society) {
      throw new Error("Please enter the correct Society Code");
    }
    if (society.email !== null) {
      throw new Error("Society is already set up");
    }

    const hashedPassword = await hashPassword(password);
    const updatedSociety = await tx.society.update({
      where: { society_code },
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: society_name,
        wing_count: no_of_wings,
        floors_per_wing: floor_per_wing,
        rooms_per_floor
      }
    });

    const flatsData = generateFlatsForSociety({ society_code, no_of_wings, floor_per_wing, rooms_per_floor });
    if (flatsData.length > 0) {
      await tx.flat.createMany({ data: flatsData });
    }

    const token = generateAuthToken({
      userId: updatedSociety.id,
      role: 'society',
      society_code: updatedSociety.society_code,
    });

    return { message: "Society is registered successfully", token };
  });
}

async function registerFederation(data) {
  const { email, password, name, apartment, tenement } = data;
  const normalizedEmail = normalizeEmail(email);
  const existingUser = await prisma.federation.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await hashPassword(password);
  const federation_code = await generateFederationCode();

  const societiesToCreate = [];
  const no_of_apartment = parseInt(apartment);
  for (let i = 0; i < no_of_apartment; i++) {
    const societyCode = await generateSocietyCode();
    societiesToCreate.push({
      society_code: societyCode,
      federation_code,
      name: `Society_${i + 1}`,
      society_type: 'Apartment'
    });
  }

  const no_of_tenement = parseInt(tenement);
  for (let i = 0; i < no_of_tenement; i++) {
    const societyCode = await generateSocietyCode();
    societiesToCreate.push({
      society_code: societyCode,
      federation_code,
      name: `Society_${i + 1}`,
      society_type: 'Tenement'
    });
  }
  return prisma.$transaction(async (tx) => {
    const newFederation = await tx.federation.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name,
        apartment_count: parseInt(apartment),
        tenement_count: parseInt(tenement),
        federation_code
      }
    });

    if (societiesToCreate.length > 0) {
      await tx.society.createMany({ data: societiesToCreate });
    }

    const token = generateAuthToken({
      userId: newFederation.id,
      role: 'federation',
      federation_code: newFederation.federation_code
    });

    return { message: "Federation is registered successfully", token };
  });
}

export const authService = {
  registerUser,
  loginUser,
  createSociety,
  getUserInfo
};