import { useState } from "react";
import './sidebar.css';

const Sidebar = ({ onPageChange }) => {
    const [currentPage, setCurrentPage] = useState("Dashboard");

    const handleClick = (e) => {
        const page = e.target.name;
        setCurrentPage(page);
        onPageChange(page); // Notify Home component
    };

    return (
        <div className="sidebar">
            <button 
                className={`links ${currentPage === "Profile" ? "active" : ""}`} 
                name="Profile" 
                onClick={handleClick}
            >
                Profile
            </button>
            <button 
                className={`links ${currentPage === "Dashboard" ? "active" : ""}`} 
                name="Dashboard" 
                onClick={handleClick}
            >
                Dashboard
            </button>
            <button 
                className={`links ${currentPage === "Settings" ? "active" : ""}`} 
                name="Settings" 
                onClick={handleClick}
            >
                Settings
            </button>
        </div>
    );
};

export default Sidebar;
