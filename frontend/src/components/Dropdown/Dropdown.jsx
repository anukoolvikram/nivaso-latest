import { useEffect, useRef, useState } from 'react';

const Dropdown = ({ label, placeholder, options, value, onChange, name, style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => { 
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const handleOptionClick = (option) => {
      onChange({ target: { name: name, value: option } });
      setIsOpen(false);
    };
  
    const displayValue = value || placeholder;
  
    return (
      <div className={`${style} relative w-full`} ref={dropdownRef}>
        <label className="block text-gray-700 mb-1.5">{label}</label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between border border-gray-200 px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors text-left"
          type="button"
        >
          <span className={`${!value ? 'text-gray-400' : 'text-gray-700'}`}>
            {displayValue}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
  
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            <ul className="py-1 text-gray-700">
              {options.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleOptionClick(option)}
                    className={`block w-full text-left px-4 py-2 hover:bg-gray-50 ${value === option ? 'bg-blue-50 text-blue-600' : ''}`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  export default Dropdown;