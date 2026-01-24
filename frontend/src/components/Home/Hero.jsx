// import { useNavigate } from 'react-router-dom';
// import { Logo } from '../../assets/icons/Logo';
// import { useState, useEffect } from 'react';

// const Hero = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     setIsLoggedIn(!!token);
//   }, []);

//   return (
//     <section id="home" className="relative flex justify-center items-center min-h-screen py-10">
//       <div className="absolute inset-0 bg-black opacity-70" />

//       {/* Main content */}
//       <div className="z-5 flex flex-col justify-center items-center min-h-screen text-center px-4">        
//         <p className="font-montserrat text-white text-xl md:text-3xl mb-6 md:mb-10 mt-10 md:mt-15">
//           For societies that run effortlessly
//         </p>
//         <div className="flex flex-col items-center w-full max-w-md mx-auto">
//           <Logo className="w-full max-w-xs" />
//           <div className="font-candal text-white text-3xl md:text-4xl mt-4">
//             Live More
//           </div>
//         </div>

//         {!isLoggedIn ? 
//         <div className="flex flex-col items-center justify-center mt-8 md:mt-10">
//           <button className="font-cormorant bg-tan text-black text-xl py-3 px-5 hover:bg-white hover:cursor-pointer transition-colors"
//             onClick={() => navigate('/')}
//           >
//             Book a Demo
//           </button>
//           <button className='font-barlow text-sm sm:text-lg text-white mt-4'
//             onClick={() => navigate('/login')}
//           >
//             Registered already? <span className='underline hover:cursor-pointer'>Login here</span>
//           </button>
//         </div>
//         :
//         <div className='flex flex-col sm:flex-row gap-4 mt-8 md:mt-10'>
//           <button className="font-cormorant bg-tan text-xl py-3 px-5 hover:bg-white hover:cursor-pointer transition-colors"
//             onClick={() => navigate('/dashboard')}
//           >
//             Go to Dashboard
//           </button>

//           <button className="font-cormorant bg-black/60 text-white text-xl py-3 px-5 ring-2 ring-inset ring-tan hover:bg-white hover:text-black hover:cursor-pointer transition-colors"
//             onClick={() => navigate('/')}
//           >
//             Explore Services
//           </button>
//         </div>
//         }
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useNavigate } from 'react-router-dom';
import { Logo } from '../../assets/icons/Logo';
import { useState, useEffect } from 'react';
import { ShieldCheck, Users, Bell } from 'lucide-react'; 

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const COMMON_OVERLAY = `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 100%)`;
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 md:pt-0">
      {/* BACKGROUND IMAGE FIX: Replace '/path-to-your-image.jpg' with your actual image path */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `${COMMON_OVERLAY}, url('/your-xxx-bg.jpg')`
        }}
      />

      {/* Mesh Pattern Overlay for extra texture */}
      <div className="absolute inset-0 opacity-10 z-0" 
           style={{ backgroundImage: `radial-gradient(#C5A358 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-3/5 text-left">
            <div className="mb-6 inline-flex items-center gap-2 py-1 px-4 border border-white/10 rounded-full bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-[0.2em]">
              The Future of Society Management
            </div>
            
            <h1 className="font-montserrat text-white text-5xl md:text-7xl font-bold leading-[1.1] mb-8">
              Community Living, <br />
              <span className="text-tan italic">Simplified.</span>
            </h1>

            <p className="font-barlow text-gray-300 text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed">
              Experience a smarter way to manage your residential society. 
              Nivaso handles the details so you can focus on building a home.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {!isLoggedIn ? (
                <>
                  <button 
                    className="group relative font-montserrat bg-tan text-black font-bold text-lg py-5 px-12 rounded-lg hover:shadow-[0_10px_30px_rgba(197,163,88,0.3)] transition-all overflow-hidden"
                    onClick={() => navigate('/')} // Or your demo route
                  >
                    <span className="relative z-10">Book a Demo</span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </button>
                  
                  {/* FIXED LOGIN BUTTON */}
                  <button 
                    className="font-montserrat border-2 border-white/10 text-white font-bold text-lg py-5 px-12 rounded-lg hover:bg-white hover:text-black transition-all"
                    onClick={() => navigate('/login')}
                  >
                    <span className='underline'>Signup here</span>
                  </button>
                </>
              ) : (
                <button 
                  className="font-montserrat bg-tan text-black font-bold text-lg py-5 px-12 rounded-lg hover:bg-white transition-all shadow-xl"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Elements */}
          <div className="w-full lg:w-2/5 relative h-[500px] flex items-center justify-center">
            <div className="relative z-10 bg-gradient-to-tr from-tan/20 to-white/5 p-[1px] rounded-full">
               <div className="bg-black/80 backdrop-blur-xl h-48 w-48 rounded-full flex flex-col items-center justify-center border border-white/10">
                  <Logo className="w-24 h-auto" />
                  <div className="mt-2 text-[10px] text-tan uppercase tracking-widest font-bold">Nivaso</div>
               </div>
            </div>

            <FeatureBadge icon={<Bell className="text-tan" size={18}/>} text="Smart Notices" pos="top-10 -left-6 md:-left-12" delay="0s" />
            <FeatureBadge icon={<ShieldCheck className="text-tan" size={18}/>} text="Safe & Secure" pos="bottom-20 -right-6" delay="1.5s" />
            <FeatureBadge icon={<Users className="text-tan" size={18}/>} text="Connect Neighbors" pos="top-24 -right-8" delay="0.7s" />
          </div>

        </div>
      </div>
    </section>
  );
};

const FeatureBadge = ({ icon, text, pos, delay }) => (
  <div className={`absolute ${pos} flex items-center gap-3 bg-[#151515]/80 backdrop-blur-sm border border-white/10 p-4 rounded-xl animate-bounce-slow shadow-2xl`} 
       style={{ animationDelay: delay }}>
    <div className="bg-white/5 p-2 rounded-lg">{icon}</div>
    <span className="text-gray-200 font-barlow font-medium text-sm whitespace-nowrap uppercase tracking-wider">{text}</span>
  </div>
);

export default Hero;