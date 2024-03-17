import axios from "../axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import Comments from "./Comments";
import moment from "moment";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { TbMessageCircle } from "react-icons/tb";

function Post({ post, setPosts, posts }) {
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
    } catch (err) {
      console.log(err);
    }

    if (!isLiked && post.userId._id != currentUser._id) {
      await axios.post("/notification", {
        receiver: post.userId._id,
        sender: currentUser._id,
        type: "Like",
        post: post._id,
        isread: false,
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
          {showDropdown && post.userId._id == currentUser._id && (
            <div className="text-black absolute w-36 right-0 -bottom-12 bg-bodyPrimary py-2 px-3 rounded-sm shadow-2xl border-2 border-bodySecondary">
              <div
                onClick={() => deleteAPost(post?._id)}
                className="flex items-center justify-between"
              >
                <p className="text-sm">Delete</p>
                <FaTrash className="text-red-500 text-sm" />
              </div>
            </div>
          )}
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

      <div className="flex items-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div
            onClick={likeAPost}
            className="border-[2px] border-bodySecondary active:scale-95 transition-all duration-150 cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
          >
            {isLiked ? (
              <FaHeart color="#fb2f55" size={14} />
            ) : (
              <FaRegHeart color="#fb2f55" size={14} />
            )}
          </div>
          <p className="md:text-[14px]">{like} likes</p>
        </div>

        <div className="flex items-center space-x-2">
          <div
            onClick={() => setShowComments(!showComments)}
            className="border-[2px] border-bodySecondary active:scale-95 transition-all duration-150 cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
          >
            <TbMessageCircle color="#5089c6" size={14} />
          </div>
          <p className="md:text-[14px]">{comments.length || 0} comments</p>
        </div>
      </div>

      <Comments {...{ comments, setComments, showComments, post }} />
    </div>
  );
}

export default Post;
