import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SocietyRegistration = () => {
  const [formData, setFormData] = useState({
    federationCode: "",
    societyCode: "",
    societyName: "",
    email: "",
    password: "",
    noOfWings: "",
    floorPerWing: "",
    roomsPerFloor: "",
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      if (value === "" || (!isNaN(value) && Number(value) > 0)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // registration function
  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
        console.log("Registration Data:", formData);
        
        const response = await fetch("/auth/society/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                society_code: formData.societyCode,
                society_name: formData.societyName,
                no_of_wings: formData.noOfWings,
                floor_per_wing: formData.floorPerWing,
                rooms_per_floor: formData.roomsPerFloor,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong");
        }

        // Store society code in local storage
        localStorage.setItem("society_code", formData.societyCode);
        
        // Navigate to the next page
        navigate("/society/flatSetup", { state: { society_code: formData.societyCode } });

    } catch (error) {
        console.error("Error during registration:", error);
        alert(error.message);
    }
};


  // login function
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/auth/society/login", {
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
            
            navigate("/society/dashboard");
        } else {
            console.error("Login failed:", data.error);
            alert("Invalid credentials");
        }
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Server error");
    }
};

  const toggleForm = () => {
    setIsRegistered(!isRegistered);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="border-2 border-black p-6 bg-white shadow-lg rounded-md w-1/2">
        <h2 className="text-xl font-bold text-center text-black mb-5">
          {isRegistered ? "Society Login" : "Society Registration"}
        </h2>

        {isRegistered ? (
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
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Login
              </button>
            </div>
            <div className="text-center mt-3">
              <button type="button" onClick={toggleForm} className="text-blue-600">
                Don't have an account? Register here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            {[
              {
                label: "Federation Code",
                name: "federationCode",
                type: "text",
                placeholder: "Enter Federation Code",
              },
              {
                label: "Society Code",
                name: "societyCode",
                type: "text",
                placeholder: "Enter Society Code",
              },
              {
                label: "Society Name",
                name: "societyName",
                type: "text",
                placeholder: "Enter Society Name",
              },
              { label: "Email", name: "email", type: "email", placeholder: "email@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "Password" },
              {
                label: "No of Wings",
                name: "noOfWings",
                type: "number",
                placeholder: "Enter Number of Wings",
              },
              {
                label: "Floor per Wing",
                name: "floorPerWing",
                type: "number",
                placeholder: "Enter Floors per Wing",
              },
              {
                label: "Rooms per Floor",
                name: "roomsPerFloor",
                type: "number",
                placeholder: "Enter Rooms per Floor",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="mb-3 flex">
                <label className="form-label w-1/3">{label}:</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                  min={type === "number" ? "1" : undefined}
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Register
              </button>
            </div>
            <div className="text-center mt-3">
              <button type="button" onClick={toggleForm} className="text-blue-600">
                Already have an account? Login here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SocietyRegistration;
