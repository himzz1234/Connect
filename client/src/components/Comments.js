import React, { useRef, useContext } from "react";
import Comment from "./Comment";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BsSendFill } from "react-icons/bs";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";

function Comments({ comments, setComments, showComments, post }) {
  const commentRef = useRef();
  const containerRef = useRef();
  const { user: currentUser } = useContext(AuthContext);

  useGSAP(
    () => {
      gsap.to(".comments", { height: "auto", duration: 0.5 });
    },
    { scope: containerRef }
  );

  const postComment = async (e) => {
    e.preventDefault();
    if (commentRef.current.value === "") return;
    const newComment = {
      userId: currentUser._id,
      text: commentRef.current.value,
      postId: post._id,
    };

    try {
      const result = await axios.post("/comment", newComment);
      setComments((prev) => [...prev, result.data]);

      commentRef.current.value = "";
      if (post.userId._id != currentUser._id) {
        await axios.post("/notification", {
          receiver: post.userId._id,
          sender: currentUser._id,
          type: "Comment",
          post: post._id,
          comment: result.data._id,
          isread: false,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div ref={containerRef}>
      <div className="mt-4 md:mt-6 border-t-2 pt-4">
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
      <div
        className={`comments pl-3 ${!showComments ? "hidden h-0" : "block"}`}
      >
        {comments?.map((c, index) => (
          <Comment
            key={index}
            comment={c}
            index={index}
            setComments={setComments}
            comments={comments}
          />
        ))}
      </div>
    </div>
  );
}

export default Comments;
