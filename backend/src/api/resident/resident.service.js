import { prisma } from '../../models/db.js';
import bcrypt from 'bcryptjs';

const getProfileById = async (residentId) => {
  return prisma.resident.findUnique({
    where: { id: residentId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      is_owner: true,
      society_code: true,
      created_at: true,
      flat_id:true,
    },
  });
};

const updateProfile = async (residentId, data) => {
  const { name, email, phone, address } = data;
  return prisma.resident.update({
    where: { id: residentId },
    data: {
      name,
      email,
      phone,
      address
    },
  });
};

const changePassword = async (residentId, data) => {
  const { oldPassword, newPassword } = data;
  const resident = await prisma.resident.findUnique({
    where: { id: residentId },
  });

  if (!resident) {
    throw new Error('Resident not found');
  }
  let isPasswordMatch = false;

  if (resident.initial_password) {
    isPasswordMatch = oldPassword === resident.initial_password;
  } else if (resident.password) {
    isPasswordMatch = await bcrypt.compare(oldPassword, resident.password);
  } else {
    throw new Error('Password has not been set. Please contact support.');
  }

  if (!isPasswordMatch) {
    throw new Error('Incorrect old password');
  }
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await prisma.resident.update({
    where: { id: residentId },
    data: {
      password: hashedNewPassword,
      initial_password: null,
    },
  });
  return { message: 'Password updated successfully' };
};

export const residentService = {
  getProfileById,
  updateProfile,
  changePassword,
};
