// import { useState } from 'react';
// import { useToast } from '../../context/ToastContext';

// const Contact = () => {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });

//   const [sending, setSending] = useState(false);
//   const showToast = useToast();

//   const handleChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSending(true);

//     const submissionData = {
//       ...form,
//       access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
//     };
    
//     try {
//       const response = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json"
//         },
//         body: JSON.stringify(submissionData)
//       });

//       const data = await response.json();

//       if (data.success) {
//         showToast("Your message has been sent successfully!");
//         setForm({ name: '', email: '', subject: '', message: '' });
//       } else {
//         console.error("Error from Web3Forms:", data);
//         showToast(data.message || "Failed to send message. Please try again.");
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//       showToast("An error occurred. Please check your connection.");
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen py-10">
//       <div className="absolute inset-0 bg-black opacity-80 z-0" />
//       <div className="relative z-5 flex flex-col md:flex-row text-white p-4 md:p-10">
//         <div className="w-full md:w-2/3 px-0 md:px-10 mb-10 md:mb-0">
//           <div className="w-full font-montserrat text-3xl md:text-4xl mb-6 md:mb-10">
//             Get in touch!
//           </div>
//           <form
//             onSubmit={handleSubmit}
//             className="flex flex-col gap-6 md:gap-10 font-barlow text-lg"
//           >
            
//             <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full md:w-1/2 border-b p-2 bg-transparent"
//                 required
//               />
//               <input
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 type="email"
//                 placeholder="E-Mail"
//                 className="w-full md:w-1/2 border-b p-2 bg-transparent"
//                 required
//               />
//             </div>
//             <input
//               name="subject"
//               value={form.subject}
//               onChange={handleChange}
//               type="text"
//               placeholder="Subject"
//               className="w-full border-b p-2 bg-transparent"
//               required
//             />
//             <textarea
//               name="message"
//               value={form.message}
//               onChange={handleChange}
//               rows={5}
//               placeholder="Your message..."
//               className="w-full border p-2 bg-transparent"
//               required
//             />
//             <div>
//               <button
//                 type="submit"
//                 disabled={sending}
//                 className="bg-white text-black px-6 py-2 hover:cursor-pointer disabled:opacity-50"
//               >
//                 {sending ? 'Sending...' : 'Send'}
//               </button>
//             </div>
//           </form>
//         </div>
        
//         {/* Contact Info Section */}
//         <div className="hidden md:block mt-15 bg-tan w-2 h-64 mx-10"></div>
//         <div className="mt-10 md:mt-15 px-0 md:px-10 h-full flex flex-col text-gray-200 text-sm md:text-lg justify-start md:justify-around gap-6 md:gap-10">
//           <div className="underline">nivaso@gmail.com</div>
//           <div>+91 8080104085</div>
//           <div>
//             <div>Rahul Bajaj Technology</div>
//             <div>Innovation Center</div>
//             <div>SINE IIT Bombay</div>
//             <div>Powai, Mumbai - 400076</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;


import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const showToast = useToast();

  const COMMON_OVERLAY = `linear-gradient(to right, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 100%)`;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    const submissionData = { ...form, access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY };
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(submissionData)
      });
      const data = await response.json();
      if (data.success) {
        showToast("Your message has been sent successfully!");
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast(data.message || "Failed to send message.");
      }
    } catch (error) {
      showToast("An error occurred. Please check your connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center py-24 overflow-hidden">
      {/* Background Image - Matching the Editorial vibe */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `${COMMON_OVERLAY}, url('/your-xxx-bg.jpg')`
        }}
      />

      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Heading & Contact Info */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-tan font-bold uppercase tracking-[0.3em] text-xs mb-4">Contact Us</h2>
            <h3 className="text-white text-4xl md:text-6xl font-montserrat font-bold leading-tight mb-12">
              Let's Start a <br /> 
              <span className="text-tan italic">Conversation.</span>
            </h3>

            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg group-hover:bg-tan group-hover:text-black transition-all">
                  <Mail size={20} />
                </div>
                <span className="text-gray-300 font-barlow text-lg">nivaso.biz@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg group-hover:bg-tan group-hover:text-black transition-all">
                  <Phone size={20} />
                </div>
                <span className="text-gray-300 font-barlow text-lg">+91 8080104085</span>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg group-hover:bg-tan group-hover:text-black transition-all">
                  <MapPin size={20} />
                </div>
                <div className="text-gray-300 font-barlow text-lg leading-relaxed">
                  E-802, Exotica CHS, Casa Rio Gold,<br />
                  Palava, Kalyan Shil Road, Dombivali-421204
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="w-full lg:w-2/3 bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8 font-barlow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-tan text-xs uppercase tracking-widest font-bold">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    className="bg-transparent border-b border-white/20 p-2 text-white focus:outline-none focus:border-tan transition-colors"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-tan text-xs uppercase tracking-widest font-bold">E-Mail Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    className="bg-transparent border-b border-white/20 p-2 text-white focus:outline-none focus:border-tan transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-tan text-xs uppercase tracking-widest font-bold">Subject</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Demo Request / Inquiry"
                  className="bg-transparent border-b border-white/20 p-2 text-white focus:outline-none focus:border-tan transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-tan text-xs uppercase tracking-widest font-bold">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="How can Nivaso help your society?"
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-tan transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="group flex items-center justify-center gap-3 w-full md:w-auto bg-tan text-black font-bold py-4 px-10 rounded-xl hover:bg-white transition-all disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Message'}
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Contact;