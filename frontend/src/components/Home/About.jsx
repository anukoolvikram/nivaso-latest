const About = () => (
  <div className="relative min-h-screen overflow-x-hidden flex justify-center items-center">
    <div className="absolute inset-0 bg-black opacity-80 z-0" />
    <div className="relative z-10 w-3/4 font-cormorant">
      <div className="">
        <SecondCard />
      </div>
    </div>
  </div>
);
export default About;

const SecondCard = () => {
  return (
    <div className='h-full px-20 sm:px-20 py-15 text-center text-white flex flex-col justify-around items-center gap-10'>
      <div className='font-barlow text-2xl border-2 border-gray-400 p-10'>
        <p>At Nivaso, we believe society management should not feel like a burden. A residential community is more than addresses; it is where people live, grow, and connect</p>
        <div className="p-4"></div>
        <p>Nivaso was built to simplify how societies function. Whether it is sending notices, managing documents, or hosting community events, we make it possible for committies and residents to focus on building a thriving neighborhood</p>
        <div className="p-4"></div>
        <p>In this age where people drift apart, Nivaso strives to bring the world closer, one society at a time</p>
      </div>
    </div>
  )
}