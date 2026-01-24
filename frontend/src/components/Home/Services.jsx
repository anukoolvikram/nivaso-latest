// /* eslint-disable react/prop-types */
// const services = [
//   {
//     title: "Automate all Operations",
//     description: "Automate notices, complaints, documents, and more. All in one powerful dashboard",
//     button_text: "Go to Dashboard",
//     link: '/'
//   },
//   {
//     title: "Consult with Experts",
//     description: "From legal to redevelopment, our trusted experts help you take wiser, bolder decisions",
//     button_text: "Go Connected",
//     link: '/'
//   },
//   {
//     title: "Engage your Community",
//     description: "Host events and engagement drives to boost bonding; make your society feel like a home",
//     button_text: "Plan an event",
//     link: '/'
//   }
// ];

// const Services = () => {
//   return (
//     <div className="relative pt-10 min-h-screen">
//       <div className="absolute inset-0 bg-black opacity-80 z-0" />
//       {/* Main content */}
//       <div className="relative z-10 p-10 text-white font-montserrat ">
//         <div className="text-3xl md:text-4xl mb-5">We help you to...</div>
//         <div className="flex flex-col items-center sm:flex-row justify-around sm:items-stretch gap-10">
//           {services.map((curr, idx) => (
//             <ServicesCard
//               key={idx}
//               title={curr.title}
//               description={curr.description}
//               button_text={curr.button_text}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Services;

// const ServicesCard = ({ title, description, button_text }) => {
//   return (
//     <div
//       className="
//         w-3/5 sm:w-1/3
//         flex flex-col justify-around items-center
//         text-white border-2 border-white
//         gap-8 md:gap-10 p-4 sm:p-6 md:p-8
//         transform transition-transform duration-300
//         hover:scale-105
//       "
//     >
//       <div className="text-lg sm:text-2xl md:text-3xl">{title}</div>
//       <div className="md:w-3/4 text-center text-md md:text-2xl font-barlow">
//         {description}
//       </div>
//       <div>
//         <button className="bg-tan p-2 sm:p-3 md:p-4 sm:text-lg text-black font-semibold hover:cursor-pointer hover:bg-white">
//           {button_text}
//         </button>
//       </div>
//     </div>
//   );
// };

import { Settings, Gavel, Users, Wallet } from 'lucide-react';

const services = [
  {
    title: "Automate all Operations",
    description: "Automate notices, complaints, documents, and more. All in one powerful dashboard.",
    button_text: "Go to Dashboard",
    icon: <Settings className="text-tan" size={28} />
  },
  {
    title: "Consult with Experts",
    description: "From legal to redevelopment, our trusted experts help you take wiser, bolder decisions.",
    button_text: "Get Connected",
    icon: <Gavel className="text-tan" size={28} />
  },
  {
    title: "Engage your Community",
    description: "Host events and engagement drives to boost bonding; make your society feel like a home.",
    button_text: "Plan an event",
    icon: <Users className="text-tan" size={28} />
  },
  {
    title: "Financial Transparency",
    description: "Automate maintenance billing and track society expenses with real-time digital accounting.",
    button_text: "Manage Finance",
    icon: <Wallet className="text-tan" size={28} />
  }
];

const COMMON_OVERLAY = `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 100%)`;

const Services = () => {
  return (
    <section 
      id="services" 
      className="relative py-24 min-h-screen flex flex-col justify-center overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `${COMMON_OVERLAY}, url('/your-xxx-bg.jpg')`
      }}
    >
      <div className="container mx-auto px-4 z-10">
        
        {/* HEADING AT THE TOP */}
        <div className="text-center mb-16">
          <h2 className="text-tan font-bold uppercase tracking-[0.4em] text-xs mb-4">Our Services</h2>
          <h3 className="text-white text-4xl md:text-5xl font-montserrat font-bold">
            We help <span className="text-tan italic">you to...</span>
          </h3>
          <div className="h-1 w-20 bg-tan mx-auto mt-6 rounded-full"></div>
        </div>

        {/* BLOCKS IN 1 ROW (HORIZONTAL) */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4 xl:gap-6">
          {services.map((curr, idx) => (
            <div 
              key={idx}
              className="flex-1 group bg-white/5 backdrop-blur-md border border-white/10 p-6 xl:p-8 rounded-2xl flex flex-col justify-between hover:bg-white/10 hover:border-tan/40 transition-all duration-500 hover:-translate-y-2 shadow-xl"
            >
              <div>
                <div className="mb-6 bg-tan/10 w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-tan group-hover:text-black transition-all duration-500">
                  {curr.icon}
                </div>
                <h4 className="text-white text-lg xl:text-xl font-bold font-montserrat mb-4 leading-tight">
                  {curr.title}
                </h4>
                <p className="text-gray-400 font-barlow text-sm xl:text-base leading-relaxed mb-8">
                  {curr.description}
                </p>
              </div>

              <button className="w-full py-3 border border-tan/50 text-tan group-hover:bg-tan group-hover:text-black font-bold text-[10px] uppercase tracking-widest rounded-lg transition-all">
                {curr.button_text}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;