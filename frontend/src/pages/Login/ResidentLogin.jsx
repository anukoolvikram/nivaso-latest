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

  // return (
  //   <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md py-6 mx-auto">
  //       <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Resident Login</h2>
  //       <form onSubmit={handleLogin} className="w-3/4 space-y-4 mx-auto">
  //         <InputField label="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} type="email" />
  //         <InputField
  //           label="Password"
  //           value={loginPassword}
  //           onChange={e => setLoginPassword(e.target.value)}
  //           isPassword
  //           showPassword={showPassword}
  //           togglePassword={() => setShowPassword(!showPassword)}
  //         />
  //         <ErrorMessage message={errorMessage} />
  //         <SubmitButton loading={loading} label="Login" />
  //       </form>
  //     </div>
  // );

  return (
    <div className="w-full animate-in fade-in duration-500">
        <h2 className="text-xl font-montserrat font-bold text-slate-800 mb-6 text-center lg:text-left">
          Resident Access
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <InputField 
            label="Email Address" 
            value={loginEmail} 
            onChange={e => setLoginEmail(e.target.value)} 
            type="email"
            placeholder="e.g. resident@nivaso.com"
          />
          <InputField
            label="Password"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            isPassword
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            placeholder="••••••••"
          />
          
          <div className="flex items-center justify-between text-xs font-medium">
            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
              <input type="checkbox" className="rounded border-slate-300 text-tan focus:ring-tan" />
              Remember me
            </label>
            <span className="text-tan hover:underline cursor-pointer">Forgot Password?</span>
          </div>

          <ErrorMessage message={errorMessage} />
          <div className="pt-2">
            <SubmitButton 
              loading={loading} 
              label="Sign In" 
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            />
          </div>
        </form>
      </div>
  );
  
};

export default ResidentLogin;
