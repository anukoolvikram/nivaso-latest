const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../models/db");

const router = express.Router();

router.post("/login", async (req, res) => {
    const client = await pool.connect();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const result = await client.query("SELECT * FROM resident WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        if (user.password === null) { 
            if (password.trim().normalize() === user.initial_password.trim().normalize()) {
                return res.status(200).json({
                    message: "Login successful",
                    society_code: user.society_code,
                });
            } else {
                return res.status(400).json({ error: "Invalid credentials" });
            }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log("User logged in:", user.email);

        res.status(200).json({
            message: "Login successful",
            society_code: user.society_code,
        });

    } catch (error) {
        console.error("Error logging in society:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    } finally {
        client.release();
    }
});



module.exports = router;
