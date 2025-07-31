/* eslint-disable react/prop-types */
import { useState } from 'react';
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
      <div className="mb-6 text-sm flex justify-center gap-4">
        <span className="font-medium">Do you have a society code?</span>
        <label className="cursor-pointer">
          <input
            type="radio"
            name="hasSocietyCode"
            checked={hasSocietyCode}
            onChange={() => setHasSocietyCode(true)}
            className="mr-1"
          />
          Yes
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            name="hasSocietyCode"
            checked={!hasSocietyCode}
            onChange={() => setHasSocietyCode(false)}
            className="mr-1"
          />
          No
        </label>
      </div>

      <form onSubmit={handleSubmit} className="w-3/4 space-y-4 mx-auto">
        {hasSocietyCode && (
          <InputField label="Society Code" name="societyCode" value={formData.societyCode} onChange={handleChange} />
        )}
        <InputField label="Society Name" name="societyName" value={formData.societyName} onChange={handleChange} />
        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <InputField label="Password" name="password" isPassword value={formData.password} showPassword={showPassword} onChange={handleChange} togglePassword={() => setShowPassword(!showPassword)} />
        <InputField label="No of Wings" name="noOfWings" type="number" value={formData.noOfWings} onChange={handleChange} onWheel={(e) => e.target.blur()}/>
        <InputField label="Floors Per Wing" name="floorPerWing" type="number" value={formData.floorPerWing} onChange={handleChange} onWheel={(e) => e.target.blur()}/>
        <InputField label="Rooms Per Floor" name="roomsPerFloor" type="number" value={formData.roomsPerFloor} onChange={handleChange} onWheel={(e) => e.target.blur()}/>

        {!hasSocietyCode && (
          <div>
            <label className="block text-sm font-medium mb-1">Society Type</label>
            <select
              name="societyType"
              value={formData.societyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Apartment">Apartment</option>
              <option value="Tenement">Tenement</option>
            </select>
          </div>
        )}

        <ErrorMessage message={errorMessage} />
        <SubmitButton loading={loading} label="Register" />
      </form>
    </>
  );
};

export default RegisterForm;