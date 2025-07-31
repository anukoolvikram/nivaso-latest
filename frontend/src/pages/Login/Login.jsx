import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {Logo} from '../../assets/icons/Logo'

// Components
import FederationLogin from "./FederationLogin";
import SocietyLogin from "./SocietyLogin";
import ResidentLogin from "./ResidentLogin";

const components = {
  Federation: () => <FederationLogin />,
  Society: () => <SocietyLogin />,
  Resident: () => <ResidentLogin />
};

export default function ButtonSwitcher() {
  const [active, setActive] = useState("Federation");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        navigate('/', { replace: true })
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [navigate, location]);


  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="w-full flex flex-row justify-between items-center p-4 bg-navy shadow-md">
        <Logo size="small"/>
        <button onClick={() => navigate("/")} className="text-gray-100 text-lg font-medium hover:text-white cursor-pointer">
          Home
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start sm:p-6">
        <div className="flex space-x-10 mb-8">
          {["Federation", "Society", "Resident"].map((tab) => (
            <div key={tab} className="flex flex-col items-center">
              <button
                onClick={() => setActive(tab)}
                className={`text-lg sm:text-xl lg:mt-2 mt-4 font-semibold transition-colors ${active === tab ? "text-blue-600" : "text-gray-600 hover:text-navy"}`}>
                {tab}
              </button>
              {active === tab && (
                <motion.div
                  layoutId="underline"
                  className="h-1 w-full mt-2 bg-blue-600 rounded"
                />
              )}
            </div>
          ))}
        </div>
        <div className="w-full max-w-xl">{components[active]()}</div>
      </div>
    </div>
  );
}
