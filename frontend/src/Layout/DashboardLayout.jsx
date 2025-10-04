/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import LogoutConfirmationDialog from '../components/Dialogs/Logout';

const DashboardLayout = ({ pageConfig, role, defaultPage }) => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('currentDashboardPage') || defaultPage);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem('currentDashboardPage', currentPage);
    }, [currentPage]);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentDashboardPage');
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };
    
    // Find the current page's configuration
    const { title, subtitle, Component: PageComponent } = pageConfig[currentPage] || {};

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <div className="flex-shrink-0">
                <Sidebar
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    role={role}
                    onLogoutClick={handleLogoutClick}
                />
            </div>
            
            <div className="flex-1 flex flex-col overflow-auto">
                <header className="w-full border-b font-montserrat border-gray-200 bg-white px-4 py-2 sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-navy-dark">{title || currentPage}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>
                    )}
                </header>
                <main className="flex-1 overflow-auto bg-gray-50">
                    {/* ✅ --- CHANGE IS HERE --- ✅
                      Render only the active PageComponent.
                      This ensures the component unmounts when you switch tabs, resetting its state.
                    */}
                    {PageComponent && <PageComponent />}
                </main>
            </div>

            <LogoutConfirmationDialog
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </div>
    );
};

export default DashboardLayout;