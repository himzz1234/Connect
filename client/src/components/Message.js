import React from "react";
import moment from "moment";

function Message({ message, currentChat }) {
  return (
    <div>
      <div
        className={`p-2 bg-secondary ${
          message.sender !== currentChat.friend._id
            ? "rounded-l-sm border-l-[#6A0DAD] border-l-2 rounded-br-sm"
            : "rounded-r-sm border-r-accent border-r-2 rounded-bl-sm"
        }`}
      >
        {message.type == "text" ? (
          <p className="text-[14px] break-words">{message.text}</p>
        ) : (
          <img src={message.url} className="w-full" />
        )}
      </div>
      <p className="text-xs mt-2 text-[#73899a]">
        {moment(message.createdAt).format("MMMM Do YYYY, h:mm a")}
      </p>
    </div>
  );
}

export default Message;
