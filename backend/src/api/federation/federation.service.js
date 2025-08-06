import prisma from '../../models/db.js';
import bcrypt from 'bcryptjs';
import { generateSocietyCode } from '../../utils/authUtils.js';

const getSocietiesByFederation = async (user) => {
  const {federation_code}=user;
  return prisma.society.findMany({
    where: { federation_code },
  });
};

const updateSociety = async (societyCode, data) => {
  const { name, society_type: newSocietyType } = data;
  return prisma.$transaction(async (tx) => {
    const originalSociety = await tx.society.findUnique({
      where: { society_code: societyCode },
    });
    if (!originalSociety) {
      throw new Error('Society not found');
    }

    const oldSocietyType = originalSociety.society_type;
    const federationCode = originalSociety.federation_code;
    const updatedSociety = await tx.society.update({
      where: { society_code: societyCode },
      data: {
        name: name,
        society_type: newSocietyType,
      },
    });

    if (oldSocietyType !== newSocietyType) {
      await tx.federation.update({
        where: { federation_code: federationCode },
        data: {
          [oldSocietyType === 'Apartment' ? 'apartment_count' : 'tenement_count']: {
            decrement: 1,
          },
        },
      });

      await tx.federation.update({
        where: { federation_code: federationCode },
        data: {
          [newSocietyType === 'Apartment' ? 'apartment_count' : 'tenement_count']: {
            increment: 1,
          },
        },
      });
    }
    return updatedSociety;
  });
};

const addSociety = async (user, data) => {
  const newSocietyCode = await generateSocietyCode();
  return prisma.society.create({
    data: {
      federation_code: user.federation_code,
      society_code: newSocietyCode,
      name: data.name,
      society_type: data.societyType,      
    },
  });
};

const deleteSociety = async (societyCode) => {
  return prisma.society.delete({
    where: { society_code: societyCode },
  });
};

const getFederationDetails = async (federationId) => {
  const federation = await prisma.federation.findUnique({
    where: { id: federationId },
    select: {
      id: true,
      name: true,
      email: true,
      federation_code: true,
      apartment_count: true,
      tenement_count: true,
    },
  });
  return federation;
};

const changePassword = async (federationId, data) => {
  const { currentPassword, newPassword } = data;
  const federation = await prisma.federation.findUnique({
    where: { id: federationId },
  });
  if (!federation) {
    throw new Error('Federation not found');
  }
  if (!federation.password) {
    throw new Error('Password has not been set');
  }
  const isPasswordValid = await bcrypt.compare(currentPassword, federation.password);
  if (!isPasswordValid) {
    throw new Error('Incorrect current password');
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.federation.update({
    where: { id: federationId },
    data: { password: hashedNewPassword },
  });
  return { message: 'Password updated successfully' };
};

export const federationService = {
  getSocietiesByFederation,
  updateSociety,
  addSociety,
  deleteSociety,
  getFederationDetails,
  changePassword,
};
