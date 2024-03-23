import React, { useState, useEffect, useContext } from "react";
import Post from "./Post";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import ReactLoading from "react-loading";
import { AnimatePresence, motion } from "framer-motion";

function Posts({ page, setPage, newPost }) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const { user } = useContext(AuthContext);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  const fetchPosts = async () => {
    setLoadingPosts(true);

    const res = await axios.get(
      `/post/timeline/${user?._id}?pageNumber=${page}`
    );

    if (res.data.posts.length == 0) {
      setHasMoreData(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
    }
    setLoadingPosts(false);
  };

  useEffect(() => {
    if (hasMoreData) {
      fetchPosts();
    }
  }, [page, hasMoreData]);

  return (
    <div className="space-y-5 posts">
      <AnimatePresence>
        {posts.map((post) => {
          return (
            <motion.div
              layout
              key={post._id}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, type: "tween" }}
            >
              <Post {...{ post, setPosts, setPage }} />
            </motion.div>
          );
        })}
      </AnimatePresence>

      {loadingPosts && hasMoreData && (
        <div className="flex items-center justify-center mt-5 py-2">
          <ReactLoading type="spin" color="#1da1f2" height={24} width={24} />
        </div>
      )}
    </div>
  );
}

export default Posts;
