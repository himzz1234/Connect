import axios from "../axios";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsSendFill } from "react-icons/bs";
import { AiFillHeart, AiFillLike } from "react-icons/ai";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { SocketContext } from "../context/SocketContext";
import Comments from "./Comments";
import moment from "moment";

function Post({ post, setPosts, posts }) {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { socket } = useContext(SocketContext);
  const commentRef = useRef();

  useMemo(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comment/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const likeAPost = async () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);

    try {
      await axios.put(`/post/${post._id}/like`, {
        userId: currentUser._id,
      });

      await axios.post("/notification", {
        receiver: post.userId,
        sender: currentUser._id,
        type: "Like",
        post: post._id,
        isread: false,
      });
    } catch (err) {
      console.log(err);
    }

    if (!isLiked && post.userId._id != currentUser._id) {
      socket.emit("sendNotification", {
        sender: currentUser,
        receiver: post.userId,
        text: "",
        type: 1,
      });
    }
  };

  const deleteAPost = async (id) => {
    try {
      setPosts(posts.filter((p) => p._id !== id));

      await axios.delete(`/post/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (commentRef.current.value === "") return;
    const newComment = {
      userId: currentUser._id,
      text: commentRef.current.value,
      postId: post._id,
    };

    if (post.userId._id != currentUser._id) {
      socket.emit("sendNotification", {
        sender: currentUser,
        receiver: post.userId,
        text: commentRef.current.value,
        type: 2,
      });
    }

    try {
      const result = await axios.post("/comment", newComment);
      await axios.post("/notification", {
        receiver: post.userId,
        sender: currentUser._id,
        type: "Comment",
        post: post._id,
        comment: result.data._id,
        isread: false,
      });

      setComments((prev) => [result.data, ...prev]);

      commentRef.current.value = "";
      setShowComments(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-bodyPrimary px-6 py-4 rounded-md">
      <div className="flex items-center space-x-4">
        <div
          style={{ backgroundImage: `url(${post.userId?.profilePicture})` }}
          className={`w-8 h-8 md:w-[44px] md:h-[44px] bg-cover rounded-full -ml-2`}
        ></div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-[14px] md:text-[15.5px] font-medium">
              {post.userId?.username}
            </h2>
            <small className="text-[11.5px] md:text-[13.5px] text-[#73899a]">
              @{post.userId.email?.split("@")[0]}
            </small>
          </div>
          <small className="text-[#73899a] text-[11px] md:text-[13px]">
            {moment(post.createdAt).format("MMMM Do YYYY, h:mm a")}
          </small>
        </div>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative cursor-pointer"
        >
          <BiDotsHorizontalRounded color="#b9b9b9" size={20} />
          <AnimatePresence>
            {showDropdown && post.userId._id == currentUser._id && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, type: "tween" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-black absolute w-36 right-0 -bottom-12 bg-bodyPrimary py-2 px-3 rounded-sm shadow-2xl border-2 border-bodySecondary"
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

      <div className="my-4">
        <h2 className="text-[14px] md:text-[15px]">{post?.desc}</h2>
        {post?.img && (
          <img
            src={post?.img}
            className="w-full max-h-[400px] my-2 object-cover rounded-md"
          />
        )}
      </div>

      <div className="flex items-center mt-4">
        <div className="flex-1 flex items-center space-x-2 relative">
          <div className="border-[2px] border-bodySecondary absolute active:scale-95 transition-all duration-150 cursor-pointer bg-[#fb2f55] w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center">
            <AiFillHeart color="white" className="text-sm" />
          </div>
          <div
            onClick={likeAPost}
            className="border-[2px] border-bodySecondary absolute z-10 left-3 active:scale-95 transition-all duration-150 cursor-pointer bg-[#2b80ff] w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
          >
            <AiFillLike color="white" className="text-sm" />
          </div>
          <p className="absolute left-[45px] text-[13px] md:text-[14px]">
            {like} people liked it!
          </p>
        </div>

        <div
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <p className="text-[12.5px] md:text-[14px]">
            {comments.length || 0} comments
          </p>
        </div>
      </div>

      <div className="mt-4 md:mt-6 border-t-2  pt-4">
        <form
          onSubmit={postComment}
          className="flex bg-bodySecondary items-center rounded-md px-2 py-2"
        >
          <input
            ref={commentRef}
            type="text"
            placeholder="Add a comment"
            className="w-full bg-transparent flex-1 text-[14px] text-black outline-none placeholder-[#A9A9A9]"
          />

          <button type="submit">
            <BsSendFill color="#1da1f2" />
          </button>
        </form>
      </div>

      <AnimatePresence>
        {showComments && (
          <Comments comments={comments} setComments={setComments} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Post;
