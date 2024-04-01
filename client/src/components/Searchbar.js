import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import SearchbarResults from "./SearchbarResults";
import useDebounce from "../hooks/useDebounce";
import axios from "../axios";
import Dropdown from "./Dropdown";
import { AnimatePresence, motion } from "framer-motion";

function Searchbar({ user }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const [showResults, setShowResults] = useState(false);

  const list = {
    hidden: {
      maxHeight: 0,
      opacity: 0,
      transition: {
        when: "afterChildren",
        type: "spring",
        bounce: 0.4,
        damping: 20,
        duration: 0.3,
      },
    },

    visible: {
      maxHeight: "210px",
      opacity: 1,
      transition: {
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    if (debounceSearchTerm) {
      fetchUsers(debounceSearchTerm);
    } else {
      setUsers([]);
      setShowResults(false);
    }
  }, [debounceSearchTerm]);

  const fetchUsers = async (str) => {
    try {
      const res = await axios.post(
        `/users?searchTerm=${str}`,
        {
          userId: user?._id,
        },
        { withCredentials: true }
      );

      if (res.data && res.data.length > 0) setShowResults(true);
      else setShowResults(false);

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 flex relative md:ml-4 mr-5">
      <Dropdown setIsOpen={setShowResults}>
        <motion.div className="w-full md:w-[400px] absolute -top-5 left-0 lg:w-[500px]">
          <div
            className={`bg-secondary ${
              showResults ? "rounded-t-md shadow-lg" : "rounded-md shadow-none"
            } flex items-center lg:px-3 py-2 px-2 w-full`}
          >
            <FiSearch color="#707e8b" className="lg:block hidden" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for friend, post or video"
              className="text-[12px] sm:text-[14px] lg:text-normal bg-transparent flex-1 outline-none placeholder-[#A9A9A9] lg:ml-2"
            />
          </div>
          <AnimatePresence>
            {showResults && (
              <motion.ul
                variants={list}
                exit="hidden"
                initial="hidden"
                animate="visible"
                className="bg-secondary scrollbar-none overflow-y-auto w-full rounded-b-md border-b-2 shadow-lg"
              >
                {users?.map((u) => (
                  <motion.li key={u._id} variants={item}>
                    <SearchbarResults u={u} user={user} />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </Dropdown>
    </div>
  );
}

export default Searchbar;
