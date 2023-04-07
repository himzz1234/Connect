import { AiOutlinePlus } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MessagePopup from "./MessagePopup";
import Conversation from "./Conversation";

function Sidebar({ onlineUsers }) {
  const { user } = useContext(AuthContext);
  const [currentChat, setCurrentChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/conversation/${user._id}`
        );

        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getConversations();
  }, []);

  return (
    <div className="relative w-3/12 h-[600px] flex flex-col bg-bodySecondary py-5 px-5 rounded-md">
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

      <div className="bg-[#28343e] py-2 px-3 rounded-md flex items-center">
        <input
          type="text"
          placeholder="Search for friends"
          className="flex-1 bg-transparent outline-none placeholder-[#617484]"
        />
        <div className="bg-[#1da1f2] rounded-full w-5 h-5 flex items-center justify-center">
          <AiOutlinePlus color="white" className="text-[14px]" />
        </div>
      </div>

      {currentChat && (
        <MessagePopup
          currentChat={currentChat}
          setCurrentChat={setCurrentChat}
          onlineUsers={onlineUsers}
        />
      )}
    </div>
  );
}

export default Sidebar;
