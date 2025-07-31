import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerFederation } from '../../services/federationService';
import { loginForAll } from '../../services/authService';
// components
import LoginForm from '../../components/Login/Federation/LoginForm';
import RegistrationForm from '../../components/Login/Federation/RegistrationForm';
import AuthFormToggle from '../../components/Login/AuthFormToggle';

const FederationLogin = () => {
    const [isRegistered, setIsRegistered] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (email, password) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const data = await loginForAll(email, password, 'federation');
            localStorage.setItem('token', data.data.token);
            navigate('/');
        } catch (err) {
            console.log('errrr', err)
            setErrorMessage(err?.response?.data?.error || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (registrationData) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const data = await registerFederation(registrationData);
            localStorage.setItem('token', data.token);
            navigate('/');
        } catch (err) {
            console.log(err);
            setErrorMessage('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsRegistered(!isRegistered);
        setErrorMessage('');
    };

    return (
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl shadow-md py-6 mx-auto">
            <div className="text-2xl font-semibold text-center mb-6">
                Federation {isRegistered ? 'Login' : 'Registration'}
            </div>

            {isRegistered ? (
                <LoginForm
                    onLogin={handleLogin}
                    loading={loading}
                    errorMessage={errorMessage}
                />
            ) : (
                <RegistrationForm
                    onRegister={handleRegister}
                    loading={loading}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />
            )}
            
            <div className="w-3/4 mx-auto mt-4">
                <AuthFormToggle
                    isRegistered={isRegistered}
                    toggleForm={toggleForm}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default FederationLogin;