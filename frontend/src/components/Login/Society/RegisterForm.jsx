/* eslint-disable react/prop-types */
import { useState } from "react";
import InputField from "../InputField";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../SubmitButton";

const RegisterForm = ({ onRegister, loading, errorMessage }) => {
  const [hasSocietyCode, setHasSocietyCode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    societyCode: "",
    societyName: "",
    email: "",
    password: "",
    noOfWings: "",
    floorPerWing: "",
    roomsPerFloor: "",
    societyType: "Apartment",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" && value !== "" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData, hasSocietyCode);
  };

  return (
    <>
      {/* Society Code Toggle */}
      <div className="mb-4 text-xs font-medium text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <span className="text-slate-600">Do you have a society code?</span>

        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="hasSocietyCode"
              checked={hasSocietyCode}
              onChange={() => setHasSocietyCode(true)}
              className="accent-slate-900"
            />
            Yes
          </label>

          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="radio"
              name="hasSocietyCode"
              checked={!hasSocietyCode}
              onChange={() => setHasSocietyCode(false)}
              className="accent-slate-900"
            />
            No
          </label>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {hasSocietyCode && (
          <InputField
            label="Society Code"
            name="societyCode"
            value={formData.societyCode}
            onChange={handleChange}
            placeholder="e.g. NV-123456"
          />
        )}

        <InputField
          label="Society Name"
          name="societyName"
          value={formData.societyName}
          onChange={handleChange}
          placeholder="e.g. Green Valley CHS"
        />

        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="e.g. admin@society.com"
        />

        <InputField
          label="Password"
          name="password"
          isPassword
          value={formData.password}
          showPassword={showPassword}
          onChange={handleChange}
          togglePassword={() => setShowPassword(!showPassword)}
          placeholder="••••••••"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            label="No of Wings"
            name="noOfWings"
            type="number"
            value={formData.noOfWings}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            placeholder="e.g. 2"
          />

          <InputField
            label="Floors / Wing"
            name="floorPerWing"
            type="number"
            value={formData.floorPerWing}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            placeholder="e.g. 14"
          />

          <InputField
            label="Rooms / Floor"
            name="roomsPerFloor"
            type="number"
            value={formData.roomsPerFloor}
            onChange={handleChange}
            onWheel={(e) => e.target.blur()}
            placeholder="e.g. 4"
          />
        </div>

        {!hasSocietyCode && (
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest font-bold text-tan">
              Society Type
            </label>
            <select
              name="societyType"
              value={formData.societyType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="Apartment">Apartment</option>
              <option value="Tenement">Tenement</option>
            </select>
          </div>
        )}

        <ErrorMessage message={errorMessage} />

        <div className="pt-2">
          <SubmitButton
            loading={loading}
            label="Create Account"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          />
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
