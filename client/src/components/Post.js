import axios from "../axios";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Comments from "./Comments";
import moment from "moment";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { TbMessageCircle2 } from "react-icons/tb";

function Post({ post, setPosts, setPage }) {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(post?.likes.length);
  const { user: currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);

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
      await axios.delete(`/post/${id}`, {
        data: {
          userId: currentUser?._id,
        },
      });

      setPosts((prevPosts) => {
        const remainingPosts = prevPosts.filter((p) => p._id !== id);

        if (remainingPosts.length <= 2) {
          setPage((prev) => prev + 1);
        }

        return remainingPosts;
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-primary px-6 py-4 rounded-md">
      <div className="flex items-start space-x-4">
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
        {post.userId._id == currentUser._id && (
          <p
            onClick={() => deleteAPost(post._id)}
            className="text-sm text-red-500 cursor-pointer hover:underline"
          >
            Delete
          </p>
        )}
      </div>

      <div className="my-4">
        <h2 className="text-[14px] md:text-[16px]">{post?.desc}</h2>
        {post?.img && (
          <div className="my-2 bg-secondary w-full rounded-md flex items-center justify-center">
            <img src={post?.img} className="max-h-[400px] object-contain" />
          </div>
        )}
      </div>

      <div className="flex items-center mt-4 space-x-8">
        <div className="flex items-center space-x-2">
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
          <p className="md:text-[14px]">{like} likes</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="border-[2px] active:scale-95 transition-all duration-150 cursor-pointer w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center">
            <TbMessageCircle2 color="#5089c6" size={14} />
          </div>
          <p className="md:text-[14px] ">{comments.length} comments</p>
        </div>
      </div>

      <Comments {...{ comments, setComments, post }} />
    </div>
  );
}

export default Post;
