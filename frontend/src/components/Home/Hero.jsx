import { useNavigate } from 'react-router-dom';
import { Logo } from '../../assets/icons/Logo';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <section id="home" className="relative flex justify-center items-center min-h-screen py-10">
      <div className="absolute inset-0 bg-black opacity-70" />

      {/* Main content */}
      <div className="z-5 flex flex-col justify-center items-center min-h-screen text-center px-4">        
        <p className="font-cormorant text-white text-xl md:text-3xl mb-6 md:mb-10 mt-10 md:mt-15">
          For societies that run effortlessly
        </p>
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <Logo className="w-full max-w-xs" />
          <div className="font-candal text-white text-3xl md:text-4xl mt-4">
            Live More
          </div>
        </div>

        {!isLoggedIn ? 
        <div className="flex flex-col items-center justify-center mt-8 md:mt-10">
          <button className="font-cormorant bg-tan text-black text-xl py-3 px-5 hover:bg-white hover:cursor-pointer transition-colors"
            onClick={() => navigate('/')}
          >
            Book a Demo
          </button>
          <button className='font-barlow text-sm sm:text-lg text-white mt-4'
            onClick={() => navigate('/login')}
          >
            Registered already? <span className='underline hover:cursor-pointer'>Login here</span>
          </button>
        </div>
        :
        <div className='flex flex-col sm:flex-row gap-4 mt-8 md:mt-10'>
          <button className="font-cormorant bg-tan text-xl py-3 px-5 hover:bg-white hover:cursor-pointer transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>

          <button className="font-cormorant bg-black/60 text-white text-xl py-3 px-5 ring-2 ring-inset ring-tan hover:bg-white hover:text-black hover:cursor-pointer transition-colors"
            onClick={() => navigate('/')}
          >
            Explore Services
          </button>
        </div>
        }
      </div>
    </section>
  );
};

export default Hero;