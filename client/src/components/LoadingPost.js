import React from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: {},
  visible: {
    backgroundColor: ["#4b5563", "#374151"],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

function LoadingPost() {
  return (
    <div className="bg-bodySecondary px-6 py-4 rounded-md">
      <div className="flex items-center space-x-4">
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-12 h-12 bg-cover rounded-full -ml-2"
        ></motion.div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <motion.h2
              variants={variants}
              initial="hidden"
              animate="visible"
              className="h-5 w-52 rounded-sm"
            ></motion.h2>
          </div>
          <motion.p
            variants={variants}
            initial="hidden"
            animate="visible"
            className="h-3 w-40 bg-gray-600 rounded-sm"
          ></motion.p>
        </div>
      </div>

      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className="my-6 w-full h-40 bg-gray-600 rounded-md"
      ></motion.div>
    </div>
  );
}

export default LoadingPost;
