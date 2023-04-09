import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiFillHeart, AiFillLike } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import { format } from "timeago.js";
import { AnimatePresence, motion } from "framer-motion";

function Post({ post, setPosts, posts }) {
  const [user, setUser] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `http://localhost:8800/api/users/${post.userId}`
      );
      setUser(res.data);
    };

    fetchUser();
  }, []);

  const likeAPost = async () => {
    try {
      await axios.put(`http://localhost:8800/api/post/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }

    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteAPost = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/post/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });

      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-bodySecondary px-6 py-4 rounded-md">
      <div className="flex items-center space-x-4">
        <div
          style={{ backgroundImage: `url(${user?.profilePicture})` }}
          className={`w-12 h-12 bg-cover rounded-full -ml-2`}
        ></div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-[15px]">{user?.username}</h2>
            <small className="text-[13.5px] text-[#73899a]">
              @{user.email?.split("@")[0]}
            </small>
          </div>
          <small className="text-[#73899a] text-[12.5px]">
            {format(post.createdAt)}
          </small>
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative cursor-pointer"
        >
          <BiDotsHorizontalRounded color="white" />
          <AnimatePresence>
            {showDropdown && post.userId == currentUser._id && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, stiffness: 60, type: "spring" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-white absolute w-36 right-0 -bottom-12 bg-bodyPrimary py-2 px-3 rounded-md shadow-2xl border-2 border-bodySecondary"
              >
                <div
                  onClick={() => deleteAPost(post?._id)}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm">Delete</p>
                  <FaTrash className="text-red-500 text-sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="my-6">
        <h2 className="text-[15px]">{post?.desc}</h2>
        {post?.img && (
          <img
            src={post?.img}
            className="w-full max-h-[400px] my-6 object-contain"
          />
        )}
      </div>

      <div className="flex items-center my-2">
        <div className="flex-1 flex items-center space-x-2">
          <div className="active:scale-95 transition-all duration-150 cursor-pointer bg-[#fb2f55] w-6 h-6 rounded-full flex items-center justify-center">
            <AiFillHeart className="text-sm" />
          </div>
          <div
            onClick={likeAPost}
            className="active:scale-95 transition-all duration-150 cursor-pointer bg-[#2b80ff] w-6 h-6 rounded-full flex items-center justify-center"
          >
            <AiFillLike className="text-sm" />
          </div>
          <small>{like} people liked it!</small>
        </div>

        <small>10 comments</small>
      </div>
    </div>
  );
}

export default Post;
