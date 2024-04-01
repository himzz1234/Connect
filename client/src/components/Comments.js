import React, { useRef, useContext, useState } from "react";
import Comment from "./Comment";
import { BsSendFill } from "react-icons/bs";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

function Comments({ comments, setComments, post }) {
  const commentRef = useRef();
  const { user: currentUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);

  const list = {
    visible: {
      opacity: 1,
      height: "auto",
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

    if (commentRef.current.value === "") return;
    const newComment = {
      userId: currentUser._id,
      text: commentRef.current.value,
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

      commentRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAComment = async (id) => {
    try {
      await axios.delete(
        `/comment/${id}`,
        { withCredentials: true },
        {
          data: {
            userId: currentUser?._id,
          },
        }
      );

      setComments((prevComments) => prevComments.filter((c) => c._id != id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {comments?.length >= 1 && (
        <p
          onClick={() => setShowComments((prev) => !prev)}
          className="text-xs sm:text-sm mt-3 hover:underline cursor-pointer text-gray_dark w-fit"
        >
          {!showComments
            ? `View all ${comments.length} comments`
            : "Hide all comments"}
        </p>
      )}

      <AnimatePresence>
        {showComments && (
          <motion.ul
            exit="hidden"
            variants={list}
            initial="hidden"
            animate="visible"
          >
            {comments?.map((comment) => (
              <motion.li variants={item} key={comment._id}>
                <Comment {...{ comment, deleteAComment }} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="flex mt-3 bg-secondary items-center rounded-md px-2 py-2 space-x-2"
      >
        <input
          ref={commentRef}
          type="text"
          placeholder="Add a comment"
          className="w-full bg-transparent flex-1 text-[13px] sm:text-[14px] outline-none placeholder-[#A9A9A9]"
        />

        <button type="submit">
          <BsSendFill color="#1da1f2" className="text-[13px] sm:text-[15px]" />
        </button>
      </form>
    </>
  );
}

export default Comments;
