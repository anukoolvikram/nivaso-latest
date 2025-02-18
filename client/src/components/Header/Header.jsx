import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./header.css";

const Header = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", checkAuth); 
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate("/login");
        window.location.reload();
    };

    return (
        <div className="header">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                {!isAuthenticated ? (
                    <li><Link to="/login">Login</Link></li>
                ) : (
                    <li><Link onClick={handleLogout} className="logout-btn">Logout</Link></li>
                )}
            </ul>
        </div>
    );
};

export default Header;
