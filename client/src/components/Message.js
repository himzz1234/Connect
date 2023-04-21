import React from "react";
import { format } from "timeago.js";

function Message({ message, index, currentChat }) {
  return (
    <div
      className={`space-y-2 w-48 ${
        message.sender !== currentChat.user._id && "self-end"
      }`}
      key={index}
    >
      <div
        className={`p-2 ${
          message.sender !== currentChat.user._id
            ? "bg-[#28343e] rounded-l-md rounded-br-md"
            : "bg-[#2b80ff] rounded-r-md rounded-bl-md"
        }`}
      >
        {message.type == "text" ? (
          <p className="text-[14px]">{message.text}</p>
        ) : (
          <img src={message.url} className="w-full" />
        )}
      </div>
      <p className="text-xs">{format(message.createdAt)}</p>
    </div>
  );
}

export default Message;
