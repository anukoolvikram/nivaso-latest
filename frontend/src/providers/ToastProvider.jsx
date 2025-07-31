/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { ToastContext } from '../context/ToastContext';

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', type: '', visible: false });
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type, visible: true });

        const timer = setTimeout(() => {
            setToast((currentToast) => {
                if (currentToast.message === message) {
                    return { ...currentToast, visible: false };
                }
                return currentToast;
            });
        }, 3000);
        return () => clearTimeout(timer); 
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast.visible && (
                <div
                    className={`fixed top-6 right-6 px-4 py-2 rounded shadow-lg text-white z-50 transition-opacity
                        ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`
                    }>
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
};