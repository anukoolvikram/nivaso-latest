import { useState } from "react";
import { motion } from "framer-motion";
import FederationRegistration from "../Registration/FederationLogin";
import SocietyRegistration from "../Registration/SocietyLogin";
import ResidentRegistration from "../Registration/ResidentLogin";

const components = {
  Federation: () => <div className="p-4 border rounded-lg"><FederationRegistration/></div>,
  Society: () => <div className="p-4 border rounded-lg"><SocietyRegistration/></div>,
  Resident: () => <div className="p-4 border rounded-lg"><ResidentRegistration/></div>,
};

export default function ButtonSwitcher() {
  const [active, setActive] = useState("Federation");

  return (
    <div className="flex flex-col items-center space-y-6 mt-10">
      <div className="relative flex space-x-6">
        {["Federation", "Society", "Resident"].map((comp) => (
          <div key={comp} className="flex flex-col items-center">
            <button
              onClick={() => setActive(comp)}
              className={`px-4 py-2 font-semibold transition-colors ${
                active === comp ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {comp}
            </button>
            {active === comp && (
              <motion.div
                layoutId="underline"
                className="h-1 w-12 bg-blue-600 rounded"
              />
            )}
          </div>
        ))}
      </div>
      <div className="w-full mx-20">{components[active]()}</div>
    </div>
  );
}
