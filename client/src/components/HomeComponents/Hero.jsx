import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Testimonials from "./Testimonials";
import image from "../../assets/bgImage.jpg";
import { color } from "framer-motion";

const sections = ["hero", "features", "about", "pricing", "contact"];

const Hero = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const navigate = useNavigate();

  const handleNavClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = document.querySelector("nav").offsetHeight; // Get the navbar height
      const offset = element.offsetTop - navbarHeight; // Adjust for the navbar height
      window.scrollTo({ top: offset, behavior: "smooth" });
      setActiveSection(id);
    }
  };
  

  return (
    <div className="relative w-full">
      {/* Background Image with Dark Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Dark Overlay */}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white flex items-center justify-between z-50">
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
                backgroundColor: "transparent", // No background initially
                color: "black", // Default text color
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#3B82F6"; // Blue background on hover
                e.target.style.color = "white"; // White text on hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"; // Remove background on mouse leave
                e.target.style.color = "black"; // Reset text color
              }}
              className={`text-lg font-semibold px-4 py-2 rounded-md ${
                activeSection === section ? "border-b-2 border-black" : ""
              }`}
              onClick={() => handleNavClick(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          <button
            className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold text-lg hover:bg-green-600 transition duration-300"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-6 mt-18">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Nivaso
        </h1>
        <p className="text-2xl text-white italic font-serif mt-2">
          Less Managing, More Living
        </p>
        <p className="mt-4 text-lg text-white opacity-90 max-w-2xl">
          Nivaso simplifies society management, so you can focus on what truly
          matters—your home, your community, and your peace of mind.
        </p>
        <div className="flex items-center justify-center mt-8 space-x-6">
          <a
            href="#"
            className="px-6 py-3 text-lg font-semibold text-black bg-white rounded-full shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </a>
          <a
            href="#"
            className="px-6 py-3 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Explore Features
          </a>
        </div>
        <Testimonials/>
      </div>
    </div>
  );
};

export default Hero;
