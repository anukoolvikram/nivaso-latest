/* eslint-disable react/prop-types */
const services = [
  {
    title: "Automate all Operations",
    description: "Automate notices, complaints, documents, and more. All in one powerful dashboard",
    button_text: "Go to Dashboard",
    link: '/'
  },
  {
    title: "Consult with Experts",
    description: "From legal to redevelopment, our trusted experts help you take wiser, bolder decisions",
    button_text: "Go Connected",
    link: '/'
  },
  {
    title: "Engage your Community",
    description: "Host events and engagement drives to boost bonding; make your society feel like a home",
    button_text: "Plan an event",
    link: '/'
  }
];

const Services = () => {
  return (
    <div className="relative pt-10 bg-hero min-h-screen">
      <div className="absolute inset-0 bg-black opacity-80 z-0" />
      {/* Main content */}
      <div className="relative z-10 p-10 text-white font-cormorant">
        <div className="text-3xl md:text-4xl mb-5">We help you to...</div>
        <div className="flex flex-col items-center sm:flex-row justify-around sm:items-stretch gap-10">
          {services.map((curr, idx) => (
            <ServicesCard
              key={idx}
              title={curr.title}
              description={curr.description}
              button_text={curr.button_text}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

const ServicesCard = ({ title, description, button_text }) => {
  return (
    <div
      className="
        w-3/5 sm:w-1/3 md:w-full
        flex flex-col justify-around items-center
        text-white border-2 border-white
        gap-8 md:gap-10 p-4 sm:p-6 md:p-8
        transform transition-transform duration-300
        hover:scale-105
      "
    >
      <div className="text-lg sm:text-2xl md:text-3xl">{title}</div>
      <div className="md:w-3/4 text-center text-md md:text-2xl font-barlow">
        {description}
      </div>
      <div>
        <button className="bg-tan p-2 sm:p-3 md:p-4 sm:text-lg text-black font-semibold hover:cursor-pointer hover:bg-white">
          {button_text}
        </button>
      </div>
    </div>
  );
};
