import React from "react";
import { motion } from "framer-motion";
import moment from "moment";

function Message({ message, currentChat }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`p-2 ${
          message.sender !== currentChat.friend._id
            ? "bg-bodySecondary rounded-l-sm border-l-[#6A0DAD] border-l-2 rounded-br-sm"
            : "bg-bodySecondary rounded-r-sm border-r-[#1DA1F2] border-r-2 rounded-bl-sm"
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
    </motion.div>
  );
}

export default Message;
