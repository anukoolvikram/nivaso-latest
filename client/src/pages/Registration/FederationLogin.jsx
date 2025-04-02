import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FederationRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFederation, setIsFederation] = useState(false);
  const [numApartments, setNumApartments] = useState("");
  const [numTenements, setNumTenements] = useState("");
  const [fedName, setFedName] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);

  const navigate = useNavigate();

  // Toggle between login and registration forms
  const toggleForm = () => {
    setIsRegistered(!isRegistered);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFedName("");
    setNumApartments("");
    setNumTenements("");
  };

  // Handle registration form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      email,
      password,
      isFederation,
      name: fedName,
      apartment: isFederation ? numApartments : 0,
      tenement: isFederation ? numTenements : 0,
    };

    try {
      const response = await fetch("http://localhost:5000/auth/federation/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("federation_code", data.federation_code);
        navigate("/federation/societySetup", { state: { federation_code: data.federation_code } });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password };

    try {
      const response = await fetch("http://localhost:5000/auth/federation/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("federation_code", data.federation_code);
        navigate("/federation/dashboard", { state: { federation_code: data.federation_code } });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="border-2 border-black p-6 bg-white shadow-lg rounded-md w-1/2">
        <h2 className="text-xl font-bold text-center text-black mb-5">Federation Login</h2>

        {isRegistered ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3 flex">
              <label className="form-label w-1/3">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="mb-3 flex">
              <label className="form-label w-1/3">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="flex justify-center mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 bg-black text-white rounded-lg">
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
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                checked={isFederation}
                onChange={() => setIsFederation(!isFederation)}
                className="mr-2"
              />
              <label>Are you a Federation?</label>
            </div>

            {isFederation && (
              <>
                <div className="mb-3">
                  <label className="form-label">Federation Name</label>
                  <input
                    type="text"
                    value={fedName}
                    onChange={(e) => setFedName(e.target.value)}
                    placeholder="Enter federation name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Apartments</label>
                  <input
                    type="number"
                    value={numApartments}
                    onChange={(e) => setNumApartments(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Tenements</label>
                  <input
                    type="number"
                    value={numTenements}
                    onChange={(e) => setNumTenements(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-center mt-4">
              <button type="submit" className="btn btn-primary px-4 py-2 bg-black text-white rounded-lg">
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

export default FederationRegistration;
