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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentRef.current.value === "") return;
    const newComment = {
      userId: currentUser._id,
      text: commentRef.current.value,
      postId: post._id,
    };

    try {
      const res = await axios.post("/comment", newComment);
      setComments((prev) => [...prev, res.data]);

      await axios.post("/notification", {
        receiver: post.userId._id,
        sender: currentUser._id,
        type: "Comment",
        post: post._id,
        isread: false,
      });

      commentRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };

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
    <motion.div>
      {comments?.length >= 1 && (
        <p
          onClick={() => setShowComments((prev) => !prev)}
          className="text-sm mt-3 hover:underline cursor-pointer text-gray_dark w-fit"
        >
          {!showComments
            ? `View all ${comments.length} comments`
            : "Hide all comments"}
        </p>
      )}

      {showComments && (
        <AnimatePresence>
          {comments?.map((comment) => (
            <motion.div
              key={comment._id}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, type: "tween" }}
            >
              <Comment {...{ comment, deleteAComment }} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex mt-3 bg-secondary items-center rounded-md px-2 py-2"
      >
        <input
          ref={commentRef}
          type="text"
          placeholder="Add a comment"
          className="w-full bg-transparent flex-1 text-[14px] outline-none placeholder-[#A9A9A9]"
        />

        <button type="submit">
          <BsSendFill color="#1da1f2" />
        </button>
      </form>
    </motion.div>
  );
}

export default Comments;
