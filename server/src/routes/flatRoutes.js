const express = require("express");
const pool = require("../models/db");
const router = express.Router();

// UPDATE FLAT DETAILS
router.post("/save", async (req, res) => {
    const client = await pool.connect();
    try {
        const { id, flat_id, occupancy } = req.body; // flat table
        const { owner_name, owner_email, owner_address, owner_phone } = req.body; // user table
        const { resident_name, resident_email, resident_phone } = req.body; // user table

        if (!id || !flat_id) {
            return res.status(400).json({ error: "Flat ID and id are required" });
        }

        await client.query("BEGIN"); // Start transaction

        // Step 1: Update the flat_id first in the flat table
        const flatUpdateResult = await client.query(
            "UPDATE flat SET flat_id = $1 WHERE id = $2 RETURNING society_code",
            [flat_id, id]
        );

        if (flatUpdateResult.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Flat not found" });
        }

        const society_code = flatUpdateResult.rows[0].society_code;

        // Step 2: Insert Owner into users table
        const ownerResult = await client.query(
            "INSERT INTO users (society_code, flat_id, name, email, address, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id",
            [society_code, flat_id, owner_name, owner_email, owner_address, owner_phone]
        );
        const owner_id = ownerResult.rows[0].user_id;

        // Step 3: Insert Resident into users table
        const residentResult = await client.query(
            "INSERT INTO users (society_code, flat_id, name, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING user_id",
            [society_code, flat_id, resident_name, resident_email, resident_phone]
        );
        const resident_id = residentResult.rows[0].user_id;

        // Step 4: Update the flat table with owner_id and resident_id
        const finalUpdateResult = await client.query(
            "UPDATE flat SET occupancy = $1, owner_id = $2, resident_id = $3 WHERE id = $4 RETURNING *",
            [occupancy, owner_id, resident_id, id]
        );

        await client.query("COMMIT"); // Commit transaction

        res.status(200).json({ 
            message: "Flat details updated successfully", 
            updatedFlat: finalUpdateResult.rows[0] 
        });

    } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction on error
        console.error("Error updating flat details:", error);
        res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
});

module.exports = router;
