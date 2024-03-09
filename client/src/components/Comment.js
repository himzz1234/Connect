import React, { useContext, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import axios from "../axios";
import moment from "moment";

function Comment({ comment, index, setComments, comments }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  const deleteAComment = async (id) => {
    try {
      setComments(comments.filter((c) => c._id != id));
      await axios.delete(`/comment/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={`${
          index != 0 && "border-t-2"
        } flex items-start space-x-4 py-3`}
      >
        <div
          style={{ backgroundImage: `url(${comment.userId.profilePicture})` }}
          className="w-8 h-8 md:w-[36px] md:h-[36px] bg-cover rounded-full -ml-2"
        ></div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="font-medium text-[14px]">
              {comment.userId.username}
            </h2>

            <p className="text-[12px] text-[#73899a]">
              {moment(comment.createdAt).format("MMMM Do YYYY, h:mm a")}
            </p>
          </div>

          <p className="text-[15px] font-medium">{comment.text}</p>
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative cursor-pointer"
        >
          <BiDotsHorizontalRounded color="#b9b9b9" size={20} />
          <AnimatePresence>
            {showDropdown && comment.userId._id == currentUser._id && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, type: "tween" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-black absolute w-36 right-0 -bottom-12 bg-bodyPrimary py-2 px-3 rounded-sm shadow-2xl border-2 border-bodySecondary"
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
