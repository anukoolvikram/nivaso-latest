import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../models/db.js'
const SECRET_KEY = process.env.JWT_SECRET;

export const hashPassword = (password) => {
  if (!password) {
    throw new Error('Password is required for hashing.');
  }
  return bcrypt.hash(password, 10);
};

export const generateAuthToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const generateFlatsForSociety = ({ society_code, no_of_wings, floor_per_wing, rooms_per_floor }) => {
  const flatsData = [];
  for (let wing = 0; wing < no_of_wings; wing++) {
    const wingName = String.fromCharCode(65 + wing); // A, B, C...
    for (let floor = 1; floor <= floor_per_wing; floor++) {
      for (let room = 1; room <= rooms_per_floor; room++) {
        const flat_number = `${wingName}${floor.toString().padStart(2, '0')}${room.toString().padStart(2, '0')}`;
        flatsData.push({
          society_code,
          flat_number,
        });
      }
    }
  }
  return flatsData;
};

export const validatePassword = (plainPassword, user) => {
  if (user.role === 'resident' && user.password === null) {
    return plainPassword.trim() === user.initial_password?.trim();
  }
  return bcrypt.compare(plainPassword, user.password);
};

export async function generateFederationCode() {
  let federation_code;
  let isUnique = false;
  while (!isUnique) {
    const randomBytes = new Uint8Array(4);
    crypto.getRandomValues(randomBytes);
    const hexString = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    federation_code = "FED" + hexString;
    const existing = await prisma.federation.findFirst({ where: { federation_code } });
    if (!existing) isUnique = true;
  }
  return federation_code;
}

export async function generateSocietyCode() {
  let societyCode;
  let isUnique = false;
  while (!isUnique) {
    const randomBytes = new Uint8Array(4);
    crypto.getRandomValues(randomBytes);
    const hexString = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    societyCode = "SOC" + hexString;
    const existingSociety = await prisma.society.findUnique({
      where: { society_code: societyCode },
    });
    if (!existingSociety) {
      isUnique = true; 
    }
  }
  return societyCode;
}

export function generatePassword(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}