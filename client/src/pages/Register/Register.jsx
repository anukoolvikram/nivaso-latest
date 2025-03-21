import React, { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFederation, setIsFederation] = useState(false);
  const [members, setMembers] = useState([{ name: "" }]);
  const [numApartments, setNumApartments] = useState("");
  const [numTenements, setNumTenements] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      email,
      password,
      confirmPassword,
      isFederation,
      numApartments: isFederation ? numApartments : null,
      numTenements: isFederation ? numTenements : null,
    });
  };

  return (
    <div
      style={{ border: "2px solid black", padding: "20px" }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <h1 style={{ color: "black" }}>Register to Nivaso!</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3 w-full mt-2">
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
        <div className="mb-3 w-full">
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
        <div className="mb-3 w-full">
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
          <label className="mr-2">Are you a Federation?</label>
          <input
            type="checkbox"
            checked={isFederation}
            onChange={(e) => setIsFederation(e.target.checked)}
          />
        </div>

        {isFederation && (
          <>
            <h6>Members of Federation</h6>
            <div className="mb-3 w-full">
              <label className="form-label">Number of Apartments</label>
              <input
                type="number"
                value={numApartments}
                onChange={(e) => setNumApartments(e.target.value)}
                placeholder="Enter number of apartments"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div className="mb-3 w-full">
              <label className="form-label">Number of Tenements</label>
              <input
                type="number"
                value={numTenements}
                onChange={(e) => setNumTenements(e.target.value)}
                placeholder="Enter number of tenements"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </>
        )}
        <div className="flex justify-center items-center mt-2">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
