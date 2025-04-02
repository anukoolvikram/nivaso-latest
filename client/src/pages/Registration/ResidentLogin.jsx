import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResidentLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/auth/resident/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await response.json();
        
        if (response.ok) {
            console.log("Login successful:", data);
            localStorage.setItem("society_code", data.society_code);
            
            navigate("/resident/dashboard");
        } else {
            console.error("Login failed:", data.error);
            alert("Invalid credentials");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Server error");
    }
};

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="border-2 border-black p-6 bg-white shadow-lg rounded-md w-1/2">
        <h2 className="text-xl font-bold text-center text-black mb-5">
          Resident Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3 flex">
            <label className="form-label w-1/3">Email:</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="mb-3 flex">
            <label className="form-label w-1/3">Password:</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResidentLogin;
