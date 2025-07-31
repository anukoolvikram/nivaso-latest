import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generatePassword } from './authUtils.js'; 
const SECRET_KEY = process.env.JWT_SECRET;

export const hashPassword = (password) => {
    return bcrypt.hash(password, 10);
};

export const generateFlatsData = ({ society_code, wing_count, floors_per_wing, rooms_per_floor }) => {
    const flatsToCreate = [];
    for (let wing = 0; wing < wing_count; wing++) {
        const wingName = String.fromCharCode(65 + wing); // A, B, C...
        for (let floor = 1; floor <= floors_per_wing; floor++) {
            for (let room = 1; room <= rooms_per_floor; room++) {
                const flat_number = `${wingName}${String(floor).padStart(2, '0')}${String(room).padStart(2, '0')}`;
                flatsToCreate.push({ flat_number, society_code });
            }
        }
    }
    return flatsToCreate;
};

export const upsertResident = async (tx, { id, name, email, phone, address, flat_id }, isOwner, society_code) => {
    if (!name || !email) return id || null;
    const existingUser = await tx.resident.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
        throw new Error(`A user with email ${email} already exists.`);
    }

    if (id) { // Update existing resident
        await tx.resident.update({
            where: { id },
            data: { name, email, phone, address },
        });
        return id;
    } else { // Create new resident
        const newResident = await tx.resident.create({
            data: {
                name,
                email,
                phone,
                address,
                is_owner: isOwner,
                society_code,
                flat_id,
                initial_password: generatePassword(10),
            },
        });
        return newResident.id;
    }
};

export const issueSocietyAuthToken = (society) => {
    const payload = {
        id: society.id,
        email: society.email,
        society_code: society.society_code,
        user_type: 'Society',
    };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};