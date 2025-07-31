import { motion } from 'framer-motion';

const Circle = () => {
  return (
    <svg height="30" width="30" xmlns="http://www.w3.org/2000/svg">
      <circle r="5" cx="15" cy="15" fill="black" />
    </svg>
  )
}

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white p-8 rounded-xl shadow-2xl backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="max-w-md w-full mx-4"
      >
        <div className="flex flex-col items-center">
          {/* Animated spinner  */}
          {/* <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
          /> */}

          {/* Loading text with animated dots */}
          <div className="flex items-center">
            {/* <h3 className="text-xl font-semibold text-gray-800">Loading</h3> */}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatDelay: 0,
                times: [0, 0.5, 1]
              }}
              className="ml-1"
            >
              <Circle />
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatDelay: 0,
                times: [0, 0.3, 0.6, 1]
              }}
            >
              <Circle />
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                repeatDelay: 0,
                times: [0, 0.2, 0.4, 0.7, 1]
              }}
            >
              <Circle />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;