/* eslint-disable react/prop-types */
import { useState } from 'react';
import InputField from '../../Login/InputField';
import ErrorMessage from '../../Login/ErrorMessage';
import SubmitButton from '../../Login/SubmitButton';

const RegistrationForm = ({ onRegister, loading, errorMessage, setErrorMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fedName, setFedName] = useState('');
    const [numApartments, setNumApartments] = useState('');
    const [numTenements, setNumTenements] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        const registrationData = { email, password, fedName, numApartments, numTenements };
        onRegister(registrationData);
    };

    return (
        <form onSubmit={handleSubmit} className="w-3/4 space-y-4 mx-auto">
            <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Password" value={password} isPassword showPassword={showPassword} onChange={(e) => setPassword(e.target.value)} togglePassword={() => setShowPassword(!showPassword)} />
            <InputField label="Confirm Password" value={confirmPassword} isPassword showPassword={showConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} togglePassword={() => setShowConfirmPassword(!showConfirmPassword)} />
            <InputField label="Federation Name" value={fedName} onChange={(e) => setFedName(e.target.value)} />
            <InputField label="No of Apartments" type="number" value={numApartments} onChange={(e) => setNumApartments(e.target.value)} onWheel={(e) => e.target.blur()} />
            <InputField label="No of Tenements" type="number" value={numTenements} onChange={(e) => setNumTenements(e.target.value)} onWheel={(e) => e.target.blur()} />
            <ErrorMessage message={errorMessage} />
            <SubmitButton loading={loading} label="Register" />
        </form>
    );
};

export default RegistrationForm;