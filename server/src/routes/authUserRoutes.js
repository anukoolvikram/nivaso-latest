const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../models/db");

const router = express.Router();

router.post("/register", async (req, res) => {
    const client = await pool.connect(); 
    try {
        const { name, email, password, society_code, flat_id, isResident, isCommunityMember } = req.body;

        // **1. Check if email already exists**
        const emailCheck = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // **2. Check if the society_code exists**
        const societyCheck = await pool.query("SELECT 1 FROM society WHERE society_code = $1", [society_code]);
        if (societyCheck.rows.length === 0) {
            return res.status(400).json({ error: "Invalid society code" });
        }

        // **3. Check if flat_id exists for the given society_code**
        const flatCheck = await pool.query("SELECT 1 FROM flats WHERE flat_id = $1 AND society_code = $2", [flat_id, society_code]);
        if (flatCheck.rows.length === 0) {
            return res.status(400).json({ error: "Flat ID not found in the given society" });
        }

        // **4. Hash the password**
        const hashedPassword = await bcrypt.hash(password, 10);

        // **5. Insert user into database**
        await client.query("BEGIN"); // Start transaction
        const insertUser = await client.query(
            `INSERT INTO users (name, email, password, society_code, flat_id, is_resident, is_community_member)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id`,
            [name, email, hashedPassword, society_code, flat_id, isResident, isCommunityMember]
        );
        await client.query("COMMIT"); // Commit transaction

        res.status(201).json({ message: "User registered successfully", user_id: insertUser.rows[0].user_id });

    } catch (error) {
        await client.query("ROLLBACK"); // Rollback on error
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        client.release(); // Release DB connection
    }
});

module.exports = router;
