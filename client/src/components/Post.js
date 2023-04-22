import axios from "../axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { AiFillHeart, AiFillLike } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaComment } from "react-icons/fa";
import { format } from "timeago.js";
import { AnimatePresence, motion } from "framer-motion";
import { SocketContext } from "../context/SocketContext";
import Comment from "./Comment";

function Post({ post, setPosts, posts }) {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { socket } = useContext(SocketContext);
  const commentRef = useRef();

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comment/${post._id}`);
        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchComments();
  }, []);

  const likeAPost = async () => {
    try {
      await axios.put(`/post/${post._id}/like`, {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }

    if (!isLiked && post.userId._id != currentUser._id) {
      socket.emit("sendNotification", {
        sender: currentUser,
        receiver: post.userId,
        type: 1,
      });
    }

    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteAPost = async (id) => {
    try {
      await axios.delete(`/post/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });

      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    const newComment = {
      userId: currentUser._id,
      text: commentRef.current.value,
      postId: post._id,
    };

    if (post.userId._id != currentUser._id) {
      socket.emit("sendNotification", {
        sender: currentUser,
        receiver: post.userId,
        type: 2,
      });
    }

    try {
      const result = await axios.post("/comment", newComment);
      setComments((prev) => [result.data, ...prev]);

      commentRef.current.value = "";
      setShowComments(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-bodySecondary px-6 py-4 rounded-md">
      <div className="flex items-center space-x-4">
        <div
          style={{ backgroundImage: `url(${post.userId?.profilePicture})` }}
          className={`w-12 h-12 bg-cover rounded-full -ml-2`}
        ></div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-[15px] font-semibold">
              {post.userId?.username}
            </h2>
            <small className="text-[12.5px] text-[#73899a]">
              @{post.userId.email?.split("@")[0]}
            </small>
          </div>
          <small className="text-[#73899a] text-[12px]">
            {format(post.createdAt)}
          </small>
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative cursor-pointer"
        >
          <BiDotsVerticalRounded color="white" />
          <AnimatePresence>
            {showDropdown && post.userId._id == currentUser._id && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, type: "tween" }}
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
        <div className="flex-1 flex items-center space-x-2 relative">
          <div className="border-[2px] border-bodySecondary absolute active:scale-95 transition-all duration-150 cursor-pointer bg-[#fb2f55] w-7 h-7 rounded-full flex items-center justify-center">
            <AiFillHeart className="text-sm" />
          </div>
          <div
            onClick={likeAPost}
            className="border-[2px] border-bodySecondary absolute z-10 left-3 active:scale-95 transition-all duration-150 cursor-pointer bg-[#2b80ff] w-7 h-7 rounded-full flex items-center justify-center"
          >
            <AiFillLike className="text-sm" />
          </div>
          <small className="absolute left-[45px]">
            {like} people liked it!
          </small>
        </div>

        <div
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <p className="text-[13px]">{comments.length || 0} comments</p>
        </div>
      </div>

      <div className="mt-10 border-t-2 border-[#28343e] py-4">
        <form onSubmit={postComment}>
          <input
            ref={commentRef}
            type="text"
            placeholder="Add a comment"
            className="w-full bg-[#28343e] placeholder-[#617484] rounded-sm px-2 py-2 text-[14px] text-white outline-none"
          />
        </form>
      </div>

      <AnimatePresence>
        {showComments && (
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
        )}
      </AnimatePresence>
    </div>
  );
}

export default Post;
