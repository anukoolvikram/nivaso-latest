/* eslint-disable react/prop-types */
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar({ sections, activeSection, onNavClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-transparent text-white z-50 py-2 backdrop-blur flex justify-center border-b border-gray-600">
        <div className="absolute inset-0 bg-black opacity-40 pointer-events-none -z-5" />
        {/* Mobile toggle */}
        <div className="md:ml-0 ml-auto">
          <button
            className="md:hidden text-gray-300"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex">
          {sections.map((sec) => (
              <button key={sec} onClick={() => onNavClick(sec)}
                className={`px-4 py-2 font-cormorant text-xl text-gray-300 hover:text-white hover:font-bold hover:cursor-pointer transition ${
                  activeSection === sec ? "underline underline-offset-22" : ""
                }`}>
                {sec[0].toUpperCase() + sec.slice(1)}
              </button>
            ))}
        </div>

        {/* Mobile sections */}
        {menuOpen && (
          <div className="md:hidden absolute top-full right-0 bg-black/50 flex flex-col">
            {sections.map((sec) => (
                <button key={sec}
                  onClick={() => {
                    onNavClick(sec);
                    setMenuOpen(false);
                  }}
                  className={`p-2 font-medium ${
                    activeSection === sec
                      ? "bg-gray-300 text-black"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {sec[0].toUpperCase() + sec.slice(1)}
                </button>
              ))}
          </div>
        )}
    </nav>
  );
}
