import React, { useContext, useState } from "react";
import Comment from "./Comment";
import { BsSendFill } from "react-icons/bs";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

function Comments({ comments, setComments, post }, ref) {
  const { user: currentUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  const list = {
    visible: {
      opacity: 1,
      height: "120px",
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.03,
        type: "tween",
        bounce: 0.2,
      },
    },

    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        when: "afterChildren",
        type: "tween",
        bounce: 0.2,
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

    exit: {
      opacity: 0,
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ref.current.value === "") return;
    const newComment = {
      userId: currentUser._id,
      text: ref.current.value,
      postId: post._id,
    };

    try {
      const res = await axios.post("/comment", newComment, {
        withCredentials: true,
      });
      setComments((prev) => [res.data, ...prev]);

      if (post.userId._id != currentUser._id) {
        await axios.post(
          "/notification",
          {
            receiver: post.userId._id,
            sender: currentUser._id,
            type: "Comment",
            post: post._id,
            comment: res.data._id,
            isread: false,
          },
          { withCredentials: true }
        );
      }

      ref.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAComment = async (id) => {
    try {
      await axios.delete(`/comment/${id}`, { withCredentials: true });

      setComments((prevComments) => prevComments.filter((c) => c._id != id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AnimatePresence>
        {comments?.length >= 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComments((prev) => !prev)}
            className="text-xs sm:text-sm mt-3 hover:underline cursor-pointer text-gray_dark w-fit"
          >
            {!showComments
              ? `View all ${comments.length} comments`
              : "Hide all comments"}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComments && comments.length >= 1 && (
          <motion.ul
            exit="hidden"
            variants={list}
            initial="hidden"
            animate="visible"
            key={`comments-${post._id}`}
            className="overflow-y-auto scrollbar scrollbar-none"
          >
            {comments?.map((comment) => (
              <motion.li layout variants={item} key={comment._id}>
                <Comment {...{ comment, deleteAComment }} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-3 relative bg-secondary">
        <input
          ref={ref}
          type="text"
          placeholder="Add a comment"
          className="w-full outline-none bg-secondary focus:outline-[#1da1f2] rounded-sm pr-10 pl-2 py-2 bg-transparent flex-1 text-[13px] sm:text-[14px] placeholder-[#A9A9A9]"
        />

        <button type="submit" className="absolute right-2 top-3">
          <BsSendFill color="#1da1f2" className="text-[13px] sm:text-[15px]" />
        </button>
      </form>
    </>
  );
}

export default React.forwardRef(Comments);
