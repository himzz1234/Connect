import React from "react";
import { motion } from "framer-motion";
import Comment from "./Comment";

function Comments({ comments, setComments }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -30 }}
      animate={{ opacity: 1, height: "fit-content", y: 0 }}
      transition={{ duration: 0.3, type: "tween" }}
      exit={{ opacity: 0, height: 0, y: -30 }}
      className="px-3"
    >
      {comments.map((c, index) => (
        <Comment
          key={index}
          comment={c}
          index={index}
          setComments={setComments}
          comments={comments}
        />
      ))}
    </motion.div>
  );
}

export default Comments;
