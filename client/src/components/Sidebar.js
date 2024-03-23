import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import MessagePopup from "./MessagePopup";
import Conversation from "./Conversation";
import { AnimatePresence } from "framer-motion";

function Sidebar({ onlineUsers }) {
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversation/${user._id}`);

        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, []);

  return (
    <div className="order-2 lg:order-3 lg:relative w-full lg:w-3/12 h-full flex flex-col bg-primary py-2 px-2 rounded-md">
      <div className="space-y-2 flex-1">
        {conversations.map((conversation) => (
          <Conversation
            key={conversation._id}
            {...{ conversation, setCurrentChat, onlineUsers }}
          />
        ))}
      </div>

      <AnimatePresence>
        {currentChat && (
          <MessagePopup {...{ currentChat, setCurrentChat, onlineUsers }} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(Sidebar);
