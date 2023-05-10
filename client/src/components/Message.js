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
    </motion.div>
  );
}

export default Message;
