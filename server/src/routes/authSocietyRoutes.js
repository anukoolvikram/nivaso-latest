const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../models/db");
const router = express.Router();

// SOCIETY SETUP by SOCIETY ADMIN
router.post("/register", async (req, res) => {
    const client = await pool.connect();
    
    try {
        let { email, password, society_code, society_name, no_of_wings, floor_per_wing, rooms_per_floor } = req.body;

        // Check if society code already exists or not (provided by Federation or Nivaso)
        const societyCodeCheck = await pool.query("SELECT * FROM society WHERE society_code = $1", [society_code]);
        if (societyCodeCheck.rows.length == 0) {
            return res.status(400).json({ error: "Please enter the correct Society Code" });
        }

        // Check if email already exists
        const emailCheck = await pool.query("SELECT * FROM society WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert Society into Database
        const societyResult = await client.query(
            `UPDATE society 
             SET email = $1, password = $2, society_name = $3, no_of_wings = $4, floor_per_wing = $5, rooms_per_floor = $6
             WHERE society_code = $7 RETURNING *`,
            [email, hashedPassword, society_name, no_of_wings, floor_per_wing, rooms_per_floor, society_code]
        );
        

        // GENERATE FLATS
        let flats = [];
        for (let wing = 0; wing < no_of_wings; wing++) {
            let wingName = String.fromCharCode(65 + wing);

            for (let floor = 1; floor <= floor_per_wing; floor++) {
                for (let room = 1; room <= rooms_per_floor; room++) {
                    let flat_id = `${wingName}${floor.toString().padStart(2, "0")}${room.toString().padStart(2, "0")}`;
                    flats.push({ society_code, flat_id });
                }
            }
        }
        
        const flatInsertQuery = `
            INSERT INTO flat (society_code, flat_id) 
            VALUES ${flats.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(",")}
        `;
        const flatInsertValues = flats.flatMap(flat => [flat.society_code, flat.flat_id]);

        await client.query(flatInsertQuery, flatInsertValues);

        res.status(201).json({
            message: "Society and flats registered successfully",
            society_code,
            total_flats: flats.length
        });

    } catch (error) {
        console.error("Error registering society:", error);
        res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
});



router.post("/login", async (req, res) => {
    const client = await pool.connect();
    try {
        const { email, password } = req.body;

        // Input Validation
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email exists
        const result = await client.query("SELECT * FROM society WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare Passwords
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            society_id: user.society_id,
        });

    } catch (error) {
        console.error("Error logging in society:", error);
        res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
});

module.exports = router;
