import { useState } from "react";
import { registerUser } from "../../services/authService"; // Ensure this function properly handles the API request
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios explicitly
import './register.css'

const Register = () => {
    const [formData, setFormData] = useState({ code: "", username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use only one API call to avoid conflicts
            const response = await axios.post("http://localhost:5000/api/auth/register", formData);

            if (response.status === 201 || response.status === 200) {
                alert("Registration Successful!");
                navigate("/login");
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.response?.data?.message || "Registration Failed!");
        }
    };

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="code" placeholder="Society Code" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
