import { motion } from "framer-motion";
import React from "react";

const Contact = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="mx-20">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full text-center font-bold text-4xl bg-gray-100 text-gray-800 py-3 rounded-xl shadow-lg mb-4"
      >
        Contact Us
      </motion.div>

      <section id="support" className="px-4 md:px-8 2xl:px-0">
        <div className="relative mx-auto max-w-c-1390 p-6">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
          
          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-10">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="w-3/5 animate_top rounded-lg bg-white shadow-lg border border-strokedark p-6"
            >
              <h2 className="text-3xl font-semibold text-black xl:text-sectiontitle2">
                Send a message
              </h2>

              <form action="" method="" style={{ width: "100%" }}>
                <div className="mb-4 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input type="text" placeholder="Full name" className="input-field" />
                  <input type="email" placeholder="Email address" className="input-field" />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input type="text" placeholder="Subject" className="input-field" />
                  <input type="text" placeholder="Phone number" className="input-field" />
                </div>

                <textarea
                  placeholder="Your Message"
                  rows={2}
                  className="input-field resize-none p-2 -mt-5"
                ></textarea>

                <div className="flex flex-wrap gap-4 xl:justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="peer hidden" id="agree-checkbox" />
                      <span className="w-5 h-5 flex items-center justify-center border-2 border-gray-400 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition">
                        ✓
                      </span>
                      <span className="text-gray-600 text-sm">
                        Agree to terms & consent to cookie usage
                      </span>
                    </label>

                  <button className="p-6">
                    Send
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="mb-12.5 text-3xl font-semibold text-white xl:text-sectiontitle2">
                Find us
              </h2>

              <div className="mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">Our Location</h3>
                <p>Hostel 17, Powai, Mumbai, 400076</p>
              </div>
              <div className="mb-7">
                <h3 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">Email Address</h3>
                <p><a href="#">yourmail@domainname.com</a></p>
              </div>
              <div>
                <h4 className="mb-4 text-metatitle3 font-medium text-black dark:text-white">Phone Number</h4>
                <p><a href="#">+009 42334 6343 843</a></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
