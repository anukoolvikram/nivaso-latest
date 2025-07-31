import { useNavigate } from 'react-router-dom';
import { Logo } from '../../assets/icons/Logo';
import { useState } from 'react';

const Hero = () => {
  const[isLoggedIn, setIsLoggedIn]=useState(false);
  const navigate = useNavigate();
  
  useState(()=>{
    const token=localStorage.getItem('token')
    setIsLoggedIn(!!token);
  },[])


  return (
     <section id="home" className="relative flex justify-center items-center bg-hero h-screen">
      <div className="absolute inset-0 bg-black opacity-70" />

      {/* Main content */}
      <div className="z-5 flex flex-col justify-center h-screen text-center">        
        <p className="font-cormorant text-white text-xl md:text-3xl m-10 mt-15">
          For societies that run effortlessly
        </p>
        <div className="flex flex-col items-center w-full">
          <Logo />
          <div className="font-candal text-white text-3xl md:text-4xl ml-auto mr-5">
            Live More
          </div>
        </div>

        {!isLoggedIn ? 
        <div className="flex flex-col items-center justify-center mt-10">
          <button className="font-cormorant bg-tan text-black text-xl py-3 px-5 hover:bg-white hover:cursor-pointer"
            onClick={() => navigate('/')}
          >
            Book a Demo
          </button>
          <button className='font-barlow sm:text-lg text-white mt-2'
            onClick={()=>navigate('/login')}
          >
            Registered already? <span className='underline hover:cursor-pointer'>Login here</span>
          </button>
        </div>
        :
        <div className='space-x-5 mt-10'>
          <button className="font-cormorant bg-tan text-xl py-3 px-5 hover:bg-white hover:cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>

          <button className="font-cormorant bg-black/60 text-white text-xl py-3 px-5 ring-2 ring-inset ring-tan hover:bg-white hover:text-black hover:cursor-pointer"
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