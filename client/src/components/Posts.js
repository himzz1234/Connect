import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Post from "./Post";

function Posts({ posts, setPosts }) {
  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <AnimatePresence key={post._id}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, stiffness: 60, type: "spring" }}
            exit={{ opacity: 0 }}
          >
            <Post post={post} setPosts={setPosts} posts={posts} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}

export default Posts;
