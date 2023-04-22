import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import MessagePopup from "./MessagePopup";
import Conversation from "./Conversation";
import { AnimatePresence, motion } from "framer-motion";

function Sidebar({ onlineUsers }) {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="order-2 lg:order-3 lg:relative w-full lg:w-3/12 lg:h-[85vh] flex flex-col bg-bodySecondary py-5 px-5 rounded-md">
      <div className="space-y-5 flex-1">
        {conversations.map((c) => (
          <Conversation
            conversation={c}
            key={c._id}
            setCurrentChat={setCurrentChat}
            onlineUsers={onlineUsers}
          />
        ))}
      </div>

      {/* <div className="bg-[#28343e] py-2 px-3 rounded-md flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for friends"
          className="flex-1 bg-transparent outline-none placeholder-[#617484]"
        />
        <div className="bg-[#1da1f2] rounded-full w-5 h-5 flex items-center justify-center">
          <AiOutlinePlus color="white" className="text-[14px]" />
        </div>
      </div> */}

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

export default Sidebar;
