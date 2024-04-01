import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import MessagePopup from "../components/MessagePopup";
import Conversation from "../components/Conversation";
import { AnimatePresence } from "framer-motion";

function Sidebar({ onlineUsers }) {
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/conversation/${user._id}`, {
          withCredentials: true,
        });

        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, []);

  return (
    <>
      <div className="space-y-1 sm:space-y-2 flex-1">
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
    </>
  );
}

export default React.memo(Sidebar);
