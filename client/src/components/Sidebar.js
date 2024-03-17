import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import MessagePopup from "./MessagePopup";
import Conversation from "./Conversation";
import { AnimatePresence, motion } from "framer-motion";

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
    <div className="order-2 lg:order-3 lg:relative w-full lg:w-3/12 h-full flex flex-col bg-bodyPrimary py-2 px-2 rounded-md">
      <div className="space-y-2 flex-1">
        {conversations.map((c) => (
          <Conversation
            conversation={c}
            key={c._id}
            setCurrentChat={setCurrentChat}
            onlineUsers={onlineUsers}
          />
        ))}
      </div>

      <AnimatePresence>
        {currentChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, type: "tween" }}
            exit={{ opacity: 0 }}
          >
            <MessagePopup
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              onlineUsers={onlineUsers}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(Sidebar);
