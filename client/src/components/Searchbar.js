import React from "react";
import { motion } from "framer-motion";
import SearchbarResults from "./SearchbarResults";

function Searchbar({ users, user }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
      exit={{ opacity: 0 }}
      className="bg-bodySecondary max-h-[210px] overflow-auto w-full md:w-[400px] lg:w-[500px] rounded-b-md text-white absolute -left-0 lg:left-0 top-10 border-t-2 border-bodyPrimary shadow-2xl"
    >
      {users?.map((u, index) => (
        <SearchbarResults key={u._id} u={u} index={index} user={user} />
      ))}
    </motion.div>
  );
}

export default Searchbar;
