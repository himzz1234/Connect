import React from "react";
import { motion } from "framer-motion";
import axios from "../axios";

function Searchbar({ users, user }) {
  const followUser = async (id) => {
    try {
      const res = await axios.post(`/conversation`, {
        senderId: user?._id,
        receiverId: id,
      });
      console.log(user?._id, id, res.data);
    } catch (error) {
      console.log(error);
    }

    await axios.put(`/users/follow/${id}`, {
      userId: user?._id,
    });

    window.location.reload();
  };

  const unfollowUser = async (id) => {
    await axios.put(`/users/unfollow/${id}`, {
      userId: user?._id,
    });

    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, type: "spring" }}
      exit={{ opacity: 0 }}
      className="bg-bodySecondary w-full md:w-[400px] lg:w-[500px] rounded-b-md text-white absolute -left-0 lg:left-0 top-10 border-t-2 border-bodyPrimary shadow-2xl"
    >
      {users?.map((u, index) => (
        <div
          key={u._id}
          className={`relative flex flex-col md:flex-row md:space-x-3 md:items-center ${
            index > 0 &&
            "before:absolute before:w-full before:h-[1px] before:bg-[#28343e] before:-top-0"
          }`}
        >
          <div className="flex flex-1 items-center space-x-3 py-3 pl-3">
            <div
              style={{ backgroundImage: `url(${u?.profilePicture})` }}
              className="w-7 h-7 md:w-9 md:h-9 bg-cover rounded-full"
            ></div>
            <div className="flex-1">
              <small className="text-[11px] text-[#73899a]">
                @{u.email?.split("@")[0]}
              </small>
              <p className="flex items-center space-x-[0.5px] text-[13px] sm:text-[14px] font-semibold">
                {u.username}
              </p>
            </div>
          </div>
          <div className="mb-2 md:mb-0">
            {user?.following.findIndex((f) => f === u._id) > -1 ? (
              <button
                onClick={() => unfollowUser(u._id)}
                className="text-[#1da1f2] text-xs px-3 py-1 rounded-sm"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => followUser(u._id)}
                className="text-[#1da1f2] text-xs px-3 py-1 rounded-sm"
              >
                Follow
              </button>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default Searchbar;
