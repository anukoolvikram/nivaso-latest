import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleAuthSuccess, register, selfRegister } from '../../services/societyService';
import { loginForAll } from '../../services/authService';
// components
import LoginForm from '../../components/Login/Society/LoginForm';
import RegisterForm from '../../components/Login/Society/RegisterForm';
import AuthFormToggle from '../../components/Login/AuthFormToggle';

const SocietyLogin = () => {
    const [isRegistered, setIsRegistered] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const response = await loginForAll(email, password, 'society');
            handleAuthSuccess(response.data, navigate);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (formData, hasCode) => {
        setLoading(true);
        setError('');
        try {
            const apiCall = hasCode ? register : selfRegister;
            const response = await apiCall(formData);
            handleAuthSuccess(response.data, navigate);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsRegistered(!isRegistered);
        setError(''); // Clear error on toggle
    };

    return (
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md py-6 mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                {isRegistered ? "Society Login" : "Society Registration"}
            </h2>

            {isRegistered ? (
                <LoginForm 
                    onLogin={handleLogin} 
                    loading={loading}
                    errorMessage={error}
                />
            ) : (
                <RegisterForm 
                    onRegister={handleRegister} 
                    loading={loading}
                    errorMessage={error}
                />
            )}

            <AuthFormToggle
                isRegistered={isRegistered}
                toggleForm={toggleForm}
                loading={loading}
            />
        </div>
    );
};

export default SocietyLogin;