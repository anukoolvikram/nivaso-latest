// const About = () => (
//   <div className="relative min-h-screen overflow-x-hidden flex justify-center items-center">
//     <div className="absolute inset-0 bg-black opacity-80 z-0" />
//     <div className="relative z-10 w-3/4 font-cormorant">
//       <div className="">
//         <SecondCard />
//       </div>
//     </div>
//   </div>
// );
// export default About;

// const SecondCard = () => {
//   return (
//     <div className='h-full px-20 sm:px-20 py-15 text-center text-white flex flex-col justify-around items-center gap-10'>
//       <div className='font-barlow text-2xl border-2 border-gray-400 p-10'>
//         <p>At Nivaso, we believe society management should not feel like a burden. A residential community is more than addresses; it is where people live, grow, and connect</p>
//         <div className="p-4"></div>
//         <p>Nivaso was built to simplify how societies function. Whether it is sending notices, managing documents, or hosting community events, we make it possible for committies and residents to focus on building a thriving neighborhood</p>
//         <div className="p-4"></div>
//         <p>In this age where people drift apart, Nivaso strives to bring the world closer, one society at a time</p>
//       </div>
//     </div>
//   )
// }

const About = () => {

  const COMMON_OVERLAY = `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 100%)`;
  
  return (
    <section 
      id="about" 
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      {/* FIX: Removed bg-[#050505] from parent. 
         Increased opacity to 100% and used a more balanced gradient 
      */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-opacity duration-700"
        style={{ 
          // This gradient ensures the left side is dark for text, but the right side shows more image
          backgroundImage: `${COMMON_OVERLAY}, url('/your-xxx-bg.jpg')`
        }}
      />

      {/* Optional: Subtle Mesh Overlay to make the image look like a 'UI background' */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ backgroundImage: `radial-gradient(#C5A358 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT SIDE: Heading Area */}
          <div className="w-full lg:w-2/5">
            <div className="space-y-6 lg:sticky lg:top-32">
              <span className="text-tan font-montserrat font-bold tracking-[0.4em] text-xs block uppercase">
                Behind the Platform
              </span>
              <h3 className="text-white text-5xl md:text-7xl font-montserrat font-extrabold leading-tight">
                Our <span className="text-tan italic">Philosophy.</span>
              </h3>
              <p className="text-gray-300 font-barlow text-xl max-w-md leading-relaxed">
                Nivaso wasn't built just to manage data. It was built to restore the essence of community.
              </p>
              
              <div className="hidden lg:block w-px h-32 bg-gradient-to-b from-tan to-transparent ml-2 mt-12"></div>
            </div>
          </div>

          {/* RIGHT SIDE: The Narrative Cards with Glassmorphism */}
          <div className="w-full lg:w-3/5 space-y-12 lg:pt-12">
            
            {/* Row 1 */}
            <div className="relative pl-8 md:pl-16 border-l border-tan/30 group bg-white/5 backdrop-blur-sm p-8 rounded-r-3xl transition-all hover:bg-white/10">
              <div className="absolute top-0 left-[-5px] w-2 h-10 bg-tan rounded-full shadow-[0_0_15px_#C5A358]"></div>
              <h4 className="text-white font-montserrat font-bold text-2xl mb-4">The Burden of Management</h4>
              <p className="text-gray-300 font-barlow text-lg md:text-xl leading-relaxed">
                We believe society management should not feel like a chore. A residential community is more than addresses; it is where people live, grow, and connect.
              </p>
            </div>

            {/* Row 2 */}
            <div className="relative pl-8 md:pl-16 border-l border-tan/30 group bg-white/5 backdrop-blur-sm p-8 rounded-r-3xl transition-all hover:bg-white/10">
              <div className="absolute top-0 left-[-5px] w-2 h-10 bg-tan rounded-full shadow-[0_0_15px_#C5A358]"></div>
              <h4 className="text-white font-montserrat font-bold text-2xl mb-4">Simplifying the Daily</h4>
              <p className="text-gray-300 font-barlow text-lg md:text-xl leading-relaxed">
                From digitizing notices to hosting community events, we enable committees and residents to focus on what truly matters: building a thriving neighborhood.
              </p>
            </div>

            {/* Row 3 */}
            <div className="relative pl-8 md:pl-16 border-l border-tan/30 group bg-white/5 backdrop-blur-sm p-8 rounded-r-3xl transition-all hover:bg-white/10">
              <div className="absolute top-0 left-[-5px] w-2 h-10 bg-tan rounded-full shadow-[0_0_15px_#C5A358]"></div>
              <h4 className="text-white font-montserrat font-bold text-2xl mb-4">A Closer World</h4>
              <p className="text-gray-200 font-barlow text-lg md:text-xl leading-relaxed italic">
                "In an age where people drift apart, Nivaso strives to bring the world closer, one society at a time."
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;