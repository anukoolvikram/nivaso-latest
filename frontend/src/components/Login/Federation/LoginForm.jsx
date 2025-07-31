/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputField from '../../Login/InputField';
import ErrorMessage from '../../Login/ErrorMessage';
import SubmitButton from '../../Login/SubmitButton';

const LoginForm = ({ onLogin, loading, errorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="w-3/4 space-y-4 mx-auto">
            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                label="Password"
                value={password}
                isPassword
                showPassword={showPassword}
                onChange={(e) => setPassword(e.target.value)}
                togglePassword={() => setShowPassword(!showPassword)}
            />
            <ErrorMessage message={errorMessage} />
            <SubmitButton loading={loading} label="Login" />
        </form>
    );
};

export default LoginForm;