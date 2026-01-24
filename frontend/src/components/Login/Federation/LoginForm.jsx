// /* eslint-disable react/prop-types */
// import { useState } from 'react';
// import InputField from '../../Login/InputField';
// import ErrorMessage from '../../Login/ErrorMessage';
// import SubmitButton from '../../Login/SubmitButton';

// const LoginForm = ({ onLogin, loading, errorMessage }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onLogin(email, password);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="w-3/4 space-y-4 mx-auto">
//             <InputField
//                 label="Email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />
//             <InputField
//                 label="Password"
//                 value={password}
//                 isPassword
//                 showPassword={showPassword}
//                 onChange={(e) => setPassword(e.target.value)}
//                 togglePassword={() => setShowPassword(!showPassword)}
//             />
//             <ErrorMessage message={errorMessage} />
//             <SubmitButton loading={loading} label="Login" />
//         </form>
//     );
// };

// export default LoginForm;

/* eslint-disable react/prop-types */
import { useState } from "react";
import InputField from "../../Login/InputField";
import ErrorMessage from "../../Login/ErrorMessage";
import SubmitButton from "../../Login/SubmitButton";

const LoginForm = ({ onLogin, loading, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <InputField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="e.g. federation@nivaso.com"
      />

      <InputField
        label="Password"
        value={password}
        isPassword
        showPassword={showPassword}
        onChange={(e) => setPassword(e.target.value)}
        togglePassword={() => setShowPassword(!showPassword)}
        placeholder="••••••••"
      />

      <div className="flex items-center justify-between text-xs font-medium">
        <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-tan focus:ring-tan"
          />
          Remember me
        </label>
        <span className="text-tan hover:underline cursor-pointer">
          Forgot Password?
        </span>
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
  );
};

export default LoginForm;
