/* eslint-disable react/prop-types */
import { HiEye, HiEyeOff } from "react-icons/hi";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  isPassword = false,
  showPassword = false,
  togglePassword,
  required = true,
  onWheel,
}) => {
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="block text-sm text-gray700 font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder || `Enter ${label}`}
          className="w-full px-4 py-2 border-[1.5px] text-sm border-gray100 rounded-lg focus:outline-none focus:ring-0"
          required={required}
          onWheel={onWheel}
        />
        {isPassword && (
          <span
            className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            onClick={togglePassword}
          >
            {showPassword ? <HiEye /> : <HiEyeOff />}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
