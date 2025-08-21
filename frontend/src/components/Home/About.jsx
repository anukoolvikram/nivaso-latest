// import malay from '../../assets/images/malay.jpg'

const About = () => (
  <div className="relative bg-hero min-h-screen overflow-x-hidden flex justify-center items-center">
    <div className="absolute inset-0 bg-black opacity-80 z-0" />
    <div className="relative z-10 w-3/4 font-cormorant">
      <div className="">
        <SecondCard />
      </div>
    </div>
  </div>
);


export default About;

// const FirstCard = () => {
//   return (
//     <div className="h-full bg-linen p-10 pt-20 min-h-screen">
//       <div className='flex justify-center text-2xl md:text-3xl mb-10'>Meet the Team</div>
//       <div className='flex flex-col justify-around gap-10'>
//         {/* Person1 */}
//         <div className="flex justify-around items-center gap-10">
//           <div className='w-2 h-40 bg-tan'></div>
//           <div>
//             <img src={malay} alt="" className='h-24' />
//           </div>
//           <div>
//             <div className='text-lg font-barlow-regular font-bold'>Malay Jani</div>
//             <div className='font-barlow'>Product & Operations</div>
//           </div>
//         </div>
//         {/* Person2 */}
//         <div className="flex justify-around items-center gap-10">
//           <div>
//             <div className='text-lg font-barlow-regular font-bold'>Malay Jani</div>
//             <div className='font-barlow'>Product & Operations</div>
//           </div>
//           <div>
//             <img src={malay} alt="" className='h-24' />
//           </div>
//           <div className='w-2 h-40 bg-tan'></div>
//         </div>
//       </div>
//     </div>
//   )
// }


const SecondCard = () => {
  return (
    <div className='h-full px-20 sm:px-20 py-15 text-center text-white flex flex-col justify-around items-center gap-10'>
      <div className='font-barlow text-2xl border-2 border-gray-400 p-10'>
        <p>At Nivaso, we believe society management shouldn't feel like a burden. A residential community is more than addresses; it's where people live, grow, and connect</p>
        <div className="p-4"></div>
        <p>Nivaso was built to simplify how societies function. Whether it's sending notices, managing documents, or hosting community events, we make it possible for committies and residents to focus on building a thriving neighborhood</p>
        <div className="p-4"></div>
        <p>In this age where people drift apart, Nivaso strives to bring the world closer, one society at a time</p>
      </div>
      {/* <div>
        <div className='text-xl font-medium'>
          "The modular pricing of software is a huge win for us. We only pay for what we need"
        </div>
        <div className='text-lg'>
          -Committee Member, XYZ Society
        </div>
      </div> */}
    </div>
  )
}