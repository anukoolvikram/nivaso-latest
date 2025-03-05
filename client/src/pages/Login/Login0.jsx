import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

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
        <div className="flex flex-col items-center justify-center h-[82vh]">
            <h2 className="mb-4 text-2xl font-semibold">Login</h2>
            <form className='flex flex-col gap-4 p-6 rounded-lg shadow-md bg-white text-center w-80' onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="code" 
                    placeholder="Society Code" 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    required 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button 
                    type="submit" 
                    className="w-full p-2 bg-black text-white rounded-md cursor-pointer text-lg hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
