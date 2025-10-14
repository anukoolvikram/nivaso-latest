import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/Login/InputField";
import SubmitButton from "../../components/Login/SubmitButton";
import ErrorMessage from "../../components/Login/ErrorMessage";
import {loginForAll} from '../../services/authService'

const ResidentLogin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginForAll(loginEmail, loginPassword, 'resident');
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (err) {
      console.log(err);
      setErrorMessage('Login Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md py-6 mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Resident Login</h2>
        <form onSubmit={handleLogin} className="w-3/4 space-y-4 mx-auto">
          <InputField label="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" />
          <InputField
            label="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            isPassword
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
          <ErrorMessage message={errorMessage} />
          <SubmitButton loading={loading} label="Login" />
        </form>
      </div>
  );
};

export default ResidentLogin;
