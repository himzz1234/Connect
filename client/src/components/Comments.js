import React from "react";
import { motion } from "framer-motion";
import Comment from "./Comment";

function Comments({ comments, setComments }) {
  return (
    <motion.div className="pl-3">
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
