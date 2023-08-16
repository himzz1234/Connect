import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Conversation({ conversation, setCurrentChat, onlineUsers }) {
  const [user, setUser] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const friend =
      conversation.sender._id != currentUser._id
        ? conversation.sender
        : conversation.receiver;
    setUser(friend);
  }, []);

  return (
    <div
      onClick={() => setCurrentChat({ conversation, user })}
      className="flex items-center cursor-pointer space-x-3"
    >
      <div className="relative">
        <div
          className={`absolute -right-0.5 -top-1 ${
            onlineUsers.includes(user?._id)
              ? "bg-[#20da97] border-[2px] border-bodyPrimary"
              : "bg-transparent"
          } w-3 h-3 rounded-full`}
        ></div>
        <div
          style={{ backgroundImage: `url(${user?.profilePicture})` }}
          className="w-8 h-8 bg-cover rounded-full -ml-2"
        ></div>
      </div>
      <p className="text-[15px] ml-2 font-medium">{user?.username}</p>
    </div>
  );
}

export default Conversation;
