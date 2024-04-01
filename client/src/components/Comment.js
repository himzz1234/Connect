import moment from "moment";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { truncate } from "../helpers";

function Comment({ comment, deleteAComment }) {
  const { user: currentUser } = useContext(AuthContext);

  return (
    <div className="flex space-x-2 sm:space-x-3 py-2 sm:py-3 pl-3">
      <div
        style={{ backgroundImage: `url(${comment.userId.profilePicture})` }}
        className="w-8 h-8 md:w-[34px] md:h-[34px] bg-cover rounded-full -ml-2"
      ></div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h2 className="font-medium text-[13px] sm:text-[14px] -mt-0.5">
            {truncate(comment.userId.username)}
          </h2>

          <p className="text-[12px] text-[#73899a] -mt-0.5">
            {moment(comment.createdAt).format("MMM Do YY")}
          </p>
        </div>

        <p className="text-[13px] sm:text-[14px]">{comment.text}</p>
      </div>
      {comment.userId._id == currentUser._id && (
        <p
          onClick={() => deleteAComment(comment._id)}
          className="text-red-500 text-[11.5px] sm:text-[12.5px] hover:underline cursor-pointer"
        >
          Delete
        </p>
      )}
    </div>
  );
}

export default Comment;
