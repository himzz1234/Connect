import React, { useState, useEffect, useContext, useRef } from "react";
import Post from "./Post";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import ReactLoading from "react-loading";
import { AnimatePresence, motion } from "framer-motion";

function Posts({ newPost }) {
  const pageRef = useRef(1);
  const elementRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [hasMoreData, setHasMoreData] = useState(true);

  function onIntersection(entries) {
    const firstEntry = entries[0];

    if (firstEntry.isIntersecting && hasMoreData) {
      fetchPosts();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);

    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `/post/timeline/${user?._id}?pageNumber=${pageRef.current}`,
        { withCredentials: true }
      );

      if (res.data.posts.length == 0) {
        setHasMoreData(false);
      } else {
        pageRef.current += 1;
        setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAPost = async (id) => {
    try {
      await axios.delete(`/post/${id}`, { withCredentials: true });
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {posts.map((post) => {
          return (
            <motion.div
              layout
              key={post._id}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Post {...{ post, deleteAPost }} />
            </motion.div>
          );
        })}

        {hasMoreData && (
          <div ref={elementRef} className="flex items-center justify-center">
            <ReactLoading type="spin" color="#1da1f2" height={20} width={20} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Posts;
