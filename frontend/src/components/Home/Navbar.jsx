/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar({ sections, activeSection, onNavClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll detection for better visual appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full text-white z-50 py-3 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-b border-gray-700' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo or brand name - add your logo here */}
        <div className="font-cormorant text-2xl font-semibold">
          Nivaso
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-6">
          {sections.map((sec) => (
            <button 
              key={sec} 
              onClick={() => onNavClick(sec)}
              className={`px-3 py-1 font-cormorant text-lg transition-all duration-300 relative group ${
                activeSection === sec ? "text-white font-bold" : "text-gray-300 hover:text-white"
              }`}
            >
              {sec[0].toUpperCase() + sec.slice(1)}
              
              {/* Custom underline effect */}
              <span className={`absolute left-0 -bottom-1 h-0.5 bg-white transition-all duration-300 ${
                activeSection === sec ? "w-full" : "w-0 group-hover:w-full"
              }`}></span>
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg transition-all duration-300 overflow-hidden ${
        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="flex flex-col py-4">
          {sections.map((sec) => (
            <button 
              key={sec}
              onClick={() => {
                onNavClick(sec);
                setMenuOpen(false);
              }}
              className={`px-6 py-3 text-left font-cormorant text-lg transition-colors ${
                activeSection === sec
                  ? "bg-white/10 text-white font-bold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {sec[0].toUpperCase() + sec.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}