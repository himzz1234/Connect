import React from "react";
import { format } from "timeago.js";
import { motion } from "framer-motion";

function Message({ message, currentChat }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`p-2 ${
          message.sender !== currentChat.user._id
            ? "bg-inputFields rounded-l-sm border-l-[#6A0DAD] border-l-2 rounded-br-sm"
            : "bg-inputFields rounded-r-sm border-r-[#1DA1F2] border-r-2 rounded-bl-sm"
        }`}
      >
        {message.type == "text" ? (
          <p className="text-[14px] break-words">{message.text}</p>
        ) : (
          <img src={message.url} className="w-full" />
        )}
      </div>
      <p className="text-xs mt-2">{format(message.createdAt)}</p>
    </motion.div>
  );
}

export default Message;
