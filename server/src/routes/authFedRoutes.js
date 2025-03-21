const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../models/db");
const crypto = require("crypto");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secret";

async function generateFederationCode() {
    let federation_code;
    let isUnique = false;

    while (!isUnique) {
        federation_code = "FED" + crypto.randomBytes(4).toString("hex"); // Generate code
        const dbCheck = await pool.query("SELECT 1 FROM federation WHERE federation_code = $1", [federation_code]);

        if (dbCheck.rows.length === 0) {
            isUnique = true; // If no duplicate, exit loop
        }
    }
    return federation_code;
}

async function generateSocietyCode(existingCodes) {
    let societyCode;
    let isUnique = false;

    while (!isUnique) {
        societyCode = "SOC" + crypto.randomBytes(4).toString("hex"); // Generate code
        const dbCheck = await pool.query("SELECT 1 FROM society WHERE society_code = $1", [societyCode]);

        if (dbCheck.rows.length === 0 && !existingCodes.has(societyCode)) {
            isUnique = true;
        }
    }
    return societyCode;
}


// REGISTER FEDERATION
router.post("/register", async (req, res) => {
    const client = await pool.connect(); // Use transaction safety
    try {
        let { email, password, isFederation, name, apartment, tenement } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let federation_code = await generateFederationCode();

        if (!isFederation) {
            name = "Unfederated";
            federation_code = "FED17032025";
        }

        // Validation Checks
        const emailCheck = await pool.query("SELECT * FROM federation WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) return res.status(400).json({ error: "Email already exists" });


        await client.query("BEGIN"); // Start transaction

        // Insert User
        const userResult = await client.query(
            "INSERT INTO federation (email, password, is_federation, name, apartment, tenement, federation_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING primary_id",
            [email, hashedPassword, isFederation, name, apartment, tenement, federation_code]
        );

        // CREATE SOCIETIES
        const no_of_apartment = parseInt(apartment);
        const no_of_tenement = parseInt(tenement);
        let societyNumber=no_of_apartment+no_of_tenement;

        const societies = [];
        const existingSocietyCodes = new Set(); // Local set to track generated codes

        for (let i = 0; i < no_of_apartment; i++) {
            const societyCode = await generateSocietyCode(existingSocietyCodes);
            existingSocietyCodes.add(societyCode); 
            
            societies.push({
                code: societyCode,
                name: `Society_${societyNumber--}`, 
                type: 'apartment'
            });
        }

        for (let i = 0; i < no_of_tenement; i++) {
            const societyCode = await generateSocietyCode(existingSocietyCodes);
            existingSocietyCodes.add(societyCode); 
            
            societies.push({
                code: societyCode,
                name: `Society_${societyNumber--}`, 
                type: 'tenement'
            });
        }

        // Insert Societies into DB
        for (const society of societies) {
            await client.query(
                "INSERT INTO society (society_code, federation_code, society_name, society_type) VALUES ($1, $2, $3, $4)",
                [society.code, federation_code, society.name, society.type]
            );
        }

        await client.query("COMMIT"); // Commit transaction
        res.status(201).json({ message: "User registered and societies created" });
    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction in case of error
        console.error("Error in Registration:", error);
        res.status(500).json({ error: "Server Error" });
    } finally {
        client.release(); // Release DB connection
    }
});

// LOGIN
router.post("/login", async (req, res) => {

});


// SOCIETY SETUP
router.post('/register/society', async (req, res) => {
    const { federation_code, society_code, society_type} = req.body;

    const query = `
        INSERT INTO society (society_code, federation_code, society_type)
        VALUES ($1, $2, $3) RETURNING *;
    `;

    try {
        const client = await pool.connect();
        const { rows } = await client.query(query, [
            society_code, federation_code, society_type
        ]);
        client.release();

        return res.status(201).json({ message: "Society registered successfully", society: rows[0] });

    } catch (error) {
        console.error('Error inserting society:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;
