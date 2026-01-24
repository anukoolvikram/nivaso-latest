// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import {Logo} from '../../assets/icons/Logo'

// // Components
// import FederationLogin from "./FederationLogin";
// import SocietyLogin from "./SocietyLogin";
// import ResidentLogin from "./ResidentLogin";

// const components = {
//   Federation: () => <FederationLogin />,
//   Society: () => <SocietyLogin />,
//   Resident: () => <ResidentLogin />
// };

// export default function ButtonSwitcher() {
//   const [active, setActive] = useState("Federation");
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         navigate('/', { replace: true })
//       } catch (err) {
//         console.error("Invalid token:", err);
//       }
//     }
//   }, [navigate, location]);


//   return (
//     <div className="min-h-screen bg-gray-50 font-inter">
//       {/* Header */}
//       <div className="w-full flex flex-row justify-between items-center p-4 bg-navy shadow-md">
//         <Logo size="small"/>
//         <button onClick={() => navigate("/")} className="text-gray-100 text-lg font-medium hover:text-white cursor-pointer">
//           Home
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 flex flex-col items-center justify-start sm:p-6">
//         <div className="flex space-x-10 mb-8">
//           {["Federation", "Society", "Resident"].map((tab) => (
//             <div key={tab} className="flex flex-col items-center">
//               <button
//                 onClick={() => setActive(tab)}
//                 className={`text-lg sm:text-xl lg:mt-2 mt-4 font-semibold transition-colors ${active === tab ? "text-blue-600" : "text-gray-600 hover:text-navy"}`}>
//                 {tab}
//               </button>
//               {active === tab && (
//                 <motion.div
//                   layoutId="underline"
//                   className="h-1 w-full mt-2 bg-blue-600 rounded"
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//         <div className="w-full max-w-xl">{components[active]()}</div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from '../../assets/icons/Logo';

// Components
import FederationLogin from "./FederationLogin";
import SocietyLogin from "./SocietyLogin";
import ResidentLogin from "./ResidentLogin";

const components = {
  Federation: <FederationLogin />,
  Society: <SocietyLogin />,
  Resident: <ResidentLogin />
};

export default function ButtonSwitcher() {
  const [active, setActive] = useState("Federation");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-inter selection:bg-tan/30">
      
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* Header */}
      <nav className="relative z-20 w-full flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200 shadow-sm">
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => navigate("/")}>
          <Logo size="small" />
        </div>
        <button 
          onClick={() => navigate("/")} 
          className="text-slate-500 text-sm font-semibold tracking-wide hover:text-tan transition-colors"
        >
          Home
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6">
        
        {/* Welcome Text */}
        <div className="text-center mb-10">
          <h1 className="text-slate-900 text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Welcome to Nivaso
          </h1>
          <p className="text-slate-500 text-lg">Choose your login type to manage your community</p>
        </div>

        {/* The Professional "Pill" Switcher */}
        <div className="bg-slate-200/50 p-1.5 rounded-2xl mb-8 flex w-full max-w-md border border-slate-200">
          {["Federation", "Society", "Resident"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`relative flex-1 py-3 text-sm font-bold transition-all duration-300 z-10 
                ${active === tab ? "text-white" : "text-slate-600 hover:text-slate-900"}`}
            >
              <span className="relative z-20">{tab}</span>
              {active === tab && (
                <motion.div
                  layoutId="activeTabLight"
                  className="absolute inset-0 bg-slate-900 rounded-xl z-0 shadow-lg shadow-slate-200"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Login Component Card */}
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50"
            >
              {components[active]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Help Link */}
        <p className="mt-8 text-slate-400 text-sm font-medium">
          Need help? <a href="mailto:nivaso.biz@gmail.com" className="text-tan hover:underline font-bold">Contact Admin</a>
        </p>
      </main>
    </div>
  );
}
