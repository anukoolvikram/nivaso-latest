import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-12 mt-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full text-center font-bold text-4xl bg-gray-100 text-gray-800 py-3 rounded-xl shadow-lg"
      >
        About Us
      </motion.div>

      {/* Main Content */}
      <div className="mt-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-center"
          >
            <p className="text-lg text-gray-900 leading-relaxed">
              <span className="font-semibold text-primary">Nivaso</span> was founded with a simple mission:  
              to make society management seamless and stress-free. Managing a residential  
              community shouldn’t feel like a second job.
            </p>

            <div className="mt-8 space-y-6">
              {[
                { title: "Our Vision", description: "To create thriving, well-connected societies through technology and innovation." },
                { title: "Our Mission", description: "Provide a platform to simplifies operations, enhances security, and engagement." },
                { title: "Our Promise", description: "No advertisements, no distractions—just powerful tools that make life easier." }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white text-lg font-semibold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-center relative"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 leading-snug">
              How Nivaso Stands Out!  
            </h2>

            <div className="mt-6 space-y-6">
              {[
                "No Data Collection for Ads",
                "AI-Powered Community Blog",
                "Modular & Cost-Effective",
                "Expert Support Services",
                "Intuitive & User-Friendly Interface"
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary text-white text-lg font-semibold shadow-md">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature}</h3>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default About;
