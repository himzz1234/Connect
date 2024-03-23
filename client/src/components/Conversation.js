import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileWindow from "./ProfileWindow";
import { AnimatePresence, motion } from "framer-motion";

function Conversation({ conversation, setCurrentChat, onlineUsers }) {
  const timeoutRef = useRef(null);
  const [friend, setFriend] = useState(null);
  const { user: currentUser } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const friend =
      conversation.sender._id != currentUser._id
        ? conversation.sender
        : conversation.receiver;

    setFriend(friend);
  }, []);

  const handleMouseOver = () => {
    if (timeoutRef.current !== null) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setShowProfile(true);
    }, 2000);
  };

  const handleMouseOut = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setShowProfile(false);
  };

  return (
    <div
      onMouseOut={handleMouseOut}
      onMouseOver={handleMouseOver}
      onClick={() => setCurrentChat({ conversation, friend })}
      className="flex items-center relative cursor-pointer w-full hover:bg-secondary py-2 rounded-md transition-all duration-150 px-2"
    >
      <AnimatePresence>
        {showProfile && <ProfileWindow id={friend._id} />}
      </AnimatePresence>
      <div
        style={{ backgroundImage: `url(${friend?.profilePicture})` }}
        className="w-9 h-9 bg-cover rounded-full"
      ></div>
      <p className="text-[15px] ml-3 font-medium flex-1">{friend?.username}</p>
      {onlineUsers.includes(friend?._id) && (
        <div className="w-2 h-2 rounded-full bg-[#32a852]"></div>
      )}
    </div>
  );
}

export default Conversation;
