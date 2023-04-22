import React, { useContext, useState } from "react";
import { format } from "timeago.js";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import axios from "../axios";

function Comment({ comment, index, setComments, comments }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  const deleteAComment = async (id) => {
    try {
      await axios.delete(`/comment/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });

      setComments(comments.filter((c) => c._id != id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1, type: "tween" }}
        exit={{ opacity: 0 }}
        className={`${
          index != 0 && "border-t-2 border-[#28343e]"
        } flex items-start space-x-4 py-3`}
      >
        <div
          style={{ backgroundImage: `url(${comment.userId.profilePicture})` }}
          className="w-10 h-10 bg-cover rounded-full -ml-2"
        ></div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-[13px]">
              {comment.userId.username}
            </h2>

            <p className="text-[11px] text-[#73899a]">
              {format(comment?.createdAt)}
            </p>
          </div>

          <p className="text-[14px]">{comment.text}</p>
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative cursor-pointer"
        >
          <BiDotsVerticalRounded color="white" />
          <AnimatePresence>
            {showDropdown && comment.userId._id == currentUser._id && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, type: "tween" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-white absolute w-36 right-0 -bottom-12 bg-bodyPrimary py-2 px-3 rounded-md shadow-2xl border-2 border-bodySecondary"
              >
                <div
                  onClick={() => deleteAComment(comment?._id)}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm">Delete</p>
                  <FaTrash className="text-red-500 text-sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Comment;
