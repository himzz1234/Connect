import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOpenInNew } from "react-icons/md";
import { GrEmoji } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AnimatePresence, motion } from "framer-motion";

function MessagePopup({ currentChat, setCurrentChat, onlineUsers }) {
  const scrollRef = useRef(null);
  const [input, setInput] = useState("");
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.conversation.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat.conversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/message/${currentChat.conversation._id}`);

        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  // useEffect(() => {
  //   scrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.conversation.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: input,
    });

    if (input !== "") {
      try {
        const message = {
          conversationId: currentChat.conversation._id,
          sender: user._id,
          text: input,
        };

        await axios.post(`/message`, message);

        setMessages((prev) => [...prev, message]);
        setInput("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="flex flex-col absolute bottom-0 right-0 w-[500px] h-96 rounded-tl-md border-t-4 border-l-4 border-r-4 border-bodyPrimary shadow-2xl bg-bodySecondary">
      <div className="flex items-center px-3 py-3 relative space-x-3 border-b-2 border-[#28343e]">
        <div className="relative">
          <div
            className={`absolute -right-0.5 -top-1 ${
              onlineUsers.includes(currentChat.user?._id)
                ? "bg-[#20da97] border-[2px] border-bodyPrimary"
                : "bg-transparent"
            } w-3 h-3 rounded-full `}
          ></div>
          <div
            style={{
              backgroundImage: `url(${currentChat.user?.profilePicture})`,
            }}
            className="w-8 h-8 bg-cover rounded-full"
          ></div>
        </div>
        <p className="flex-1">{currentChat.user?.username}</p>
        <MdOpenInNew
          className="text-xl cursor-pointer"
          color="#1da1f2"
          onClick={() => setCurrentChat(null)}
        />
      </div>

      <div className="h-2/3 flex flex-col py-5 px-3 space-y-4 overflow-auto scrollbar scrollbar-w-0">
        {messages.map((message, index) => (
          <div
            ref={scrollRef}
            className={`space-y-2 w-48 ${
              message.sender !== currentChat.user._id && "self-end"
            }`}
            key={index}
          >
            <div
              className={`p-2 ${
                message.sender !== currentChat.user._id
                  ? "bg-[#28343e] rounded-l-md rounded-br-md"
                  : "bg-[#2b80ff] rounded-r-md rounded-bl-md"
              }`}
            >
              <p className="text-[14px]">{message.text}</p>
            </div>
            <p className="text-xs">{format(message.createdAt)}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="bg-[#28343e] p-2 flex items-center rounded-md m-3 relative"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="text-[16px] flex-1 bg-transparent outline-none placeholder-[#617484]"
        />
        {showEmojis ? (
          <div onClick={() => setShowEmojis(false)}>
            <MdClose className="text-xl cursor-pointer" color="#1da1f2" />
          </div>
        ) : (
          <div onClick={() => setShowEmojis(true)}>
            <GrEmoji className="text-xl cursor-pointer" color="#c7d6e5" />
          </div>
        )}
      </form>
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 1, y: 400 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: "tween" }}
            exit={{ opacity: 1, y: 400 }}
            className="border-[#2f3c47] rounded-sm"
          >
            <Picker
              data={data}
              onEmojiSelect={(e) => setInput(input + e.native)}
              emojiSize={20}
              dynamicWidth={true}
              previewPosition="none"
              searchPosition="none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MessagePopup;
