import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import SearchbarResults from "./SearchbarResults";
import useDebounce from "../hooks/useDebounce";
import axios from "../axios";

function Searchbar({ user }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debounceSearchTerm) {
      fetchUsers(debounceSearchTerm);
    } else {
      setUsers([]);
    }
  }, [debounceSearchTerm]);

  const fetchUsers = async (username) => {
    const res = await axios.post("/users", {
      userId: user?._id,
    });

    setUsers(
      res.data.filter((user) =>
        user.username.toLowerCase().includes(username.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="flex-1 flex relative ml-4">
        <div
          className={`bg-bodySecondary ${
            users.length > 0 ? "rounded-t-md" : "rounded-md"
          } flex items-center lg:px-3 py-2 px-2 w-full md:w-[400px] lg:w-[500px]`}
        >
          <FiSearch color="#707e8b" className="lg:block hidden" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for friend, post or video"
            className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-normal bg-transparent text-black flex-1 outline-none placeholder-[#A9A9A9] lg:ml-2"
          />
        </div>

        <AnimatePresence>
          {users.length > 0 && (
            <div className="bg-bodyPrimary max-h-[210px] scrollbar-none scrollbar-track-bodySecondary scrollbar-thumb-bodyPrimary overflow-auto w-full md:w-[400px] lg:w-[500px] rounded-b-md text-white absolute -left-0 lg:left-0 top-10 border-t-2 border-bodyPrimary shadow-lg">
              {users?.map((u, index) => (
                <SearchbarResults key={u._id} u={u} index={index} user={user} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default Searchbar;
