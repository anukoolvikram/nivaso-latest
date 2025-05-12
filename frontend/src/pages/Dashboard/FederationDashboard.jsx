import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import FederationSocietySetup from '../../components/FederationDashboard/FederationSocietySetup';

const FederationDashboard = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentDashboardPage') || "Society Setup";
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    const isFederation = localStorage.getItem('user_type') === 'federation';

    if (!isLoggedIn || !isFederation) {
      console.log('go to login');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Save page state to localStorage when it changes
    localStorage.setItem('currentDashboardPage', currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.clear(); // Or remove specific keys if needed
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="w-4/5 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{currentPage}</h2>
          <div className="space-x-2">
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page-specific content */}
        {currentPage === "Society Setup" && (
          <div className="text-gray-700">
            <FederationSocietySetup/>
          </div>
        )}

        {/* {currentPage === "Noticeboard" && (
          <div className="text-gray-700">
            <p>Notice</p>
          </div>
        )}
        {currentPage === "Community" && (
          <div className="text-gray-700">
            <p>Community</p>
          </div>
        )}
        {currentPage === "Complaints" && (
          <div className="text-gray-700">
            <p>Complaints</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FederationDashboard;
