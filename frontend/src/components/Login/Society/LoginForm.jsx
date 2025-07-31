/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputField from "../InputField";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../SubmitButton";

const LoginForm = ({ onLogin, loading, errorMessage }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the data up to the parent to handle the API call
        onLogin(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="w-3/4 space-y-4 mx-auto">
            <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Password" isPassword value={password} showPassword={showPassword} onChange={(e) => setPassword(e.target.value)} togglePassword={() => setShowPassword(!showPassword)}/>
            <ErrorMessage message={errorMessage} />
            <SubmitButton loading={loading} label="Login" />
        </form>
    );
};

export default LoginForm;