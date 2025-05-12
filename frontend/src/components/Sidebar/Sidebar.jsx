import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentPage, onPageChange }) => {
  const navigate = useNavigate();
  const user_type = localStorage.getItem('user_type');

  function handleLogoClick() {
    navigate('/');
  }

  const residentPages = ["Noticeboard", "Community", "Complaints"];
  // const federationPages = ["Society Setup", "Noticeboard", "Community", "Complaints"];
  const federationPages = ["Society Setup"];
  const societyPages = ["Flat Setup", "Noticeboard", "Community", "Complaints"];

  const pagesToShow = user_type === "resident" ? residentPages : user_type==="federation"? federationPages : societyPages;

  return (
    <div style={{ backgroundColor: '#42A8B4' }} className="w-1/5 min-h-screen text-white p-4 flex flex-col gap-4">
      <img src="/nivaso_logo.jpg" alt="Nivaso Logo" onClick={handleLogoClick} className="cursor-pointer mb-4" />

      {pagesToShow.map((page) => (
        <button
          key={page}
          className={`py-2 px-4 rounded text-left transition-all ${
            currentPage === page
              ? 'bg-blue-600 font-semibold'
              : 'hover:bg-gray-700'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
