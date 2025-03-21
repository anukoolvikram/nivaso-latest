import React from "react";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function App() {
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="text-center">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
              className="w-24 mx-auto"
              alt="logo"
            />
            <h4 className="mt-4 text-lg font-semibold">Welcome to Nivaso</h4>
          </div>
          <p className="text-center mt-2 text-gray-600">Please login to your account</p>

          <div className="mt-6">
            
            <input
              type="number"
              name="code"
              placeholder="Society Code"
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="text" 
              name="username" 
              placeholder="Username" 
              onChange={handleChange} 
              required 
              className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
               type="password" 
               name="password" 
               placeholder="Password" 
               onChange={handleChange} 
               required 
              className="w-full mt-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button className="w-full mt-6 py-2 bg-gradient-to-r from-black to-gray-300 text-white rounded-lg hover:opacity-90 transition">
              Sign in
            </button>
            <div className="text-center mt-2">
              <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
                Go to Home
              </a>
            </div>
          </div>

          <div className="flex justify-center items-center mt-6">
            <p className="text-sm">Register?</p>
            <a href='/register' className="ml-2 px-4 py-2 bg-gray-300 black rounded-sm hover:bg-gray-600 hover:text-white transition">  
              Sign Up
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-gray-400 to-black text-white p-8">
          <h4 className="text-lg font-semibold mb-4">We are more than just a company</h4>
          <p className="text-sm text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
