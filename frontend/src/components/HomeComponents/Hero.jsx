import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Testimonials from "./Testimonials";
import image from "../../assets/bgImage.jpg";

const sections = ["hero", "features", "about", "pricing", "contact"];

const Hero = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const isLoggedIn = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    navigate('/');
  };

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = document.querySelector("nav").offsetHeight;
      const offset = element.offsetTop - navbarHeight;
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const handleDashboardNavigation = () => {
    const dashboard = localStorage.getItem('user_type');
    if (dashboard) {
      navigate(`/${dashboard}/dashboard`);
    }
  };

  const handleLoginNavigation = () => {
    // console.log('logging')
    navigate("/login");
  };

  return (
    <div className="relative w-full">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white flex items-center justify-between z-50 shadow-md">
        <h2
          className="text-xl font-bold ml-4 text-black cursor-pointer"
          onClick={() => handleNavClick("hero")}
        >
          Nivaso
        </h2>
        <div className="flex space-x-4 mr-4 bg-white p-2">
          {sections
            .filter((section) => section !== "hero")
            .map((section) => (
              <button
                key={section}
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  transition: "background-color 0.3s, color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#3B82F6";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "black";
                }}
                className={`text-lg font-semibold px-4 py-2 rounded-md ${
                  activeSection === section ? "border-b-2 border-black" : ""
                }`}
                onClick={() => handleNavClick(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          <div className="ml-2 flex space-x-2">
            {!isLoggedIn ? (
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 font-semibold text-lg hover:bg-blue-500 hover:text-white transition duration-300"
                onClick={handleLoginNavigation}
              >
                Login
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold text-lg hover:bg-blue-600 transition duration-300"
                  onClick={handleDashboardNavigation}
                >
                  Dashboard
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold text-lg hover:bg-red-600 transition duration-300"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-6 mt-8">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Nivaso
        </h1>
        <p className="text-2xl text-white italic font-serif">
          Less Managing, More Living
        </p>
        <p className="mt-2 text-md text-white opacity-90 max-w-2xl">
          Nivaso simplifies society management, so you can focus on what truly
          matters—your home, your community, and your peace of mind.
        </p>
        <div className="flex items-center justify-center mt-4 space-x-6">
          <button
            className="px-6 py-2 text-lg font-semibold hover:bg-black hover:text-white text-black bg-white rounded-full shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
          <button
            className="px-6 py-2 text-lg font-semibold text-white border-1 border-white rounded-full hover:bg-black hover:text-black transition duration-300"
            onClick={() => handleNavClick("features")}
          >
            Explore Features
          </button>
        </div>
        <Testimonials />
      </div>
    </div>
  );
};

export default Hero;