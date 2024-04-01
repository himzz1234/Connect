import axios from "../axios";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Comments from "./Comments";
import moment from "moment";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { TbMessageCircle2 } from "react-icons/tb";
import { truncate } from "../helpers";

function Post({ post, deleteAPost }) {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);

  useMemo(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [post.likes]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/comment/${post._id}`, {
        withCredentials: true,
      });
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
      await axios.put(
        `/post/${post._id}/like`,
        {
          userId: currentUser._id,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }

    if (!isLiked && post.userId._id != currentUser._id) {
      await axios.post(
        "/notification",
        {
          receiver: post.userId._id,
          sender: currentUser._id,
          type: "Like",
          post: post._id,
          isread: false,
        },
        { withCredentials: true }
      );
    }
  };

  return (
    <div className="bg-primary px-2 py-2 sm:px-6 sm:py-4 rounded-md">
      <div className="flex items-start space-x-2 sm:space-x-4">
        <div
          style={{ backgroundImage: `url(${post.userId?.profilePicture})` }}
          className={`w-9 h-9 sm:w-[40px] sm:h-[40px] md:w-[44px] md:h-[44px] bg-cover rounded-full sm:-ml-2`}
        ></div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center space-x-2">
            <h2 className="text-[13px] sm:text-[15.5px] font-medium">
              {truncate(post.userId?.username)}
            </h2>
            <small className="text-[11.5px] sm:text-[12.5px] md:text-[13.5px] text-[#73899a]">
              @{post.userId.email?.split("@")[0]}
            </small>
          </div>
          <p className="text-[#73899a] text-[11px] sm:text-[12px] md:text-[13px]">
            {moment(post.createdAt).format("MMM Do YY")}
          </p>
        </div>
        {post.userId._id == currentUser._id && (
          <p
            onClick={() => deleteAPost(post._id)}
            className="text-xs sm:text-sm text-red-500 cursor-pointer hover:underline"
          >
            Delete
          </p>
        )}
      </div>

      <div className="my-4">
        <h2 className="text-[14px] md:text-[17px] font-medium">{post?.desc}</h2>
        {post?.img && (
          <div className="my-2 border-t-2 border-b-2 w-full flex items-center justify-center">
            <img src={post?.img} className="max-h-[300px] object-contain" />
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 space-x-3 sm:space-x-8">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div
            onClick={likeAPost}
            className="border-[2px] active:scale-95 transition-all duration-150 cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center"
          >
            {isLiked ? (
              <FaHeart color="#fb2f55" size={14} />
            ) : (
              <FaRegHeart color="#fb2f55" size={14} />
            )}
          </div>
          <p className="text-[13px] sm:text-[14px]">
            {like} <span className="hidden sm:inline-block">likes</span>
          </p>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="border-[2px] active:scale-95 transition-all duration-150 cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center">
            <TbMessageCircle2 color="#5089c6" size={14} />
          </div>
          <p className="text-[13px] sm:text-[14px]">
            {comments.length}{" "}
            <span className="hidden sm:inline-block">comments</span>
          </p>
        </div>
      </div>

      <Comments {...{ comments, setComments, post }} />
    </div>
  );
}

export default Post;
