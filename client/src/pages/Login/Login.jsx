import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import './login.css';

const Login = () => {
    const [formData, setFormData] = useState({ code: "", username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            localStorage.setItem("token", response.data.token);
            navigate("/", { replace: true });  
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed!");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="code" placeholder="Society Code" onChange={handleChange} required />
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
