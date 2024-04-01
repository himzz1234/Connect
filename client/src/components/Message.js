import React from "react";
import moment from "moment";

function Message({ message, currentChat }) {
  return (
    <div
      className={`w-48 py-3 flex flex-col ${
        message.sender !== currentChat?.friend._id ? "ml-auto" : "mr-auto"
      }`}
    >
      <div
        className={`p-2 space-y-2  ${
          message.sender !== currentChat.friend._id
            ? "rounded-t-md rounded-l-md bg-accent text-white"
            : "rounded-t-md rounded-r-md bg-secondary"
        }`}
      >
        {message.url && (
          <img
            src={message.url}
            alt="gif"
            className=" w-full object-contain rounded-sm"
          />
        )}
        {message.text && (
          <p className="text-[14px] break-words">{message.text}</p>
        )}
      </div>
      <p className="text-xs mt-2 text-[#73899a]">
        {moment(message.createdAt).format("MMMM Do YYYY, h:mm a")}
      </p>
    </div>
  );
}

export default Message;
