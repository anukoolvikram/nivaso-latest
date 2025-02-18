const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// **User Registration**
exports.register = async (req, res) => {
    try {
        const { code, username, password } = req.body;

        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ code, username, password: hashedPassword });        
        await user.save();  
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// **User Login**
exports.login = async (req, res) => {
    try {
        const { code, username, password } = req.body;

        const user = await User.findOne({ code, username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { code: user.code, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// **Protected Route**
exports.protectedRoute = (req, res) => {
    res.json({ message: "Access granted", user: req.user });
};
