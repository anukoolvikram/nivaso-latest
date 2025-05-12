import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import ResidentNoticeboard from '../../components/ResidentDashboard/ResidentNoticeboard';
import ResidentCommunity from '../../components/ResidentDashboard/ResidentCommunity';
import ResidentComplaints from '../../components/ResidentDashboard/ResidentComplaints';


const ResidentDashboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(() => {
    // Initialize state from localStorage or default to "Noticeboard"
    return localStorage.getItem('currentDashboardPage') || "Noticeboard";
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    const isResident = localStorage.getItem('user_type') === 'resident';
    
    if (!isLoggedIn || !isResident) {
      navigate('/login');
    }
  }, [navigate]);

  // Update localStorage whenever currentPage changes
  useEffect(() => {
    localStorage.setItem('currentDashboardPage', currentPage);
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="w-4/5 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{currentPage}</h2>
          <div>
            <button
              onClick={()=>{navigate('/')}}
              className="bg-green-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page-specific content */}
        {currentPage === "Noticeboard" && (
          <div className="text-gray-700">
            <ResidentNoticeboard/>
          </div>
        )}
        {currentPage === "Community" && (
          <div className="text-gray-700">
            <ResidentCommunity/>
          </div>
        )}
        {currentPage === "Complaints" && (
          <div className="text-gray-700">
            <ResidentComplaints/>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;