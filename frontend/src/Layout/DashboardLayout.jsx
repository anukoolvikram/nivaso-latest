// /* eslint-disable react/prop-types */
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar/Sidebar';
// import LogoutConfirmationDialog from '../components/Dialogs/Logout';

// const DashboardLayout = ({ pageConfig, role, defaultPage }) => {
//     const navigate = useNavigate();
//     const [currentPage, setCurrentPage] = useState(() => {
//         const saved = localStorage.getItem(`currentDashboardPage_${role}`);
//         return saved || defaultPage;
//     });
//     const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             navigate('/login');
//         }
//     }, [navigate]);

//     useEffect(() => {
//         localStorage.setItem(`currentDashboardPage_${role}`, currentPage);
//     }, [currentPage, role]);

//     const handleLogoutClick = () => {
//         setIsLogoutModalOpen(true);
//     };

//     const handleConfirmLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem(`currentDashboardPage_${role}`);
//         setIsLogoutModalOpen(false);
//         navigate('/');
//     };

//     const handleCancelLogout = () => {
//         setIsLogoutModalOpen(false);
//     };

//     // Find the current page's configuration
//     const { title, subtitle, Component: PageComponent } = pageConfig[currentPage] || {};

//     return (
//         <div className="flex h-screen overflow-hidden bg-gray-50">
//             <div className="flex-shrink-0">
//                 <Sidebar
//                     currentPage={currentPage}
//                     onPageChange={setCurrentPage}
//                     role={role}
//                     onLogoutClick={handleLogoutClick}
//                 />
//             </div>

//             <div className="flex-1 flex flex-col overflow-auto">
//                 <header className="w-full border-b font-montserrat border-gray-200 bg-white px-4 py-2 sticky top-0 z-10">
//                     <h1 className="text-xl font-bold text-navy-dark">{title || currentPage}</h1>
//                     {subtitle && (
//                         <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>
//                     )}
//                 </header>
//                 <main className="flex-1 overflow-auto bg-gray-50">
//                     {PageComponent && <PageComponent />}
//                 </main>
//             </div>

//             <LogoutConfirmationDialog
//                 isOpen={isLogoutModalOpen}
//                 onConfirm={handleConfirmLogout}
//                 onCancel={handleCancelLogout}
//             />
//         </div>
//     );
// };

// export default DashboardLayout;

/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import LogoutConfirmationDialog from '../components/Dialogs/Logout';
import { Menu, X } from 'lucide-react'; // Suggested icon library

const DashboardLayout = ({ pageConfig, role, defaultPage }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(() => {
        const saved = localStorage.getItem(`currentDashboardPage_${role}`);
        return saved || defaultPage;
    });
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem(`currentDashboardPage_${role}`, currentPage);
    }, [currentPage, role]);

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem(`currentDashboardPage_${role}`);
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const { title, subtitle, Component: PageComponent } = pageConfig[currentPage] || {};

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar
                    currentPage={currentPage}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        setIsSidebarOpen(false); // Close sidebar on mobile after selection
                    }}
                    role={role}
                    onLogoutClick={() => setIsLogoutModalOpen(true)}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="w-full border-b font-montserrat border-gray-200 bg-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Hamburger Menu Button */}
                        <button 
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold text-navy-dark leading-none">{title || currentPage}</h1>
                            {subtitle && (
                                <p className="text-xs md:text-sm text-gray-500 font-medium mt-1 hidden sm:block">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
                    {PageComponent && <PageComponent />}
                </main>
            </div>

            <LogoutConfirmationDialog
                isOpen={isLogoutModalOpen}
                onConfirm={handleConfirmLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
};

export default DashboardLayout;