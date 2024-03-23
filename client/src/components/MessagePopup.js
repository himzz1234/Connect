import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AiOutlineGif } from "react-icons/ai";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import Message from "./Message";
import GIFContainer from "./GIFContainer";
import { motion } from "framer-motion";

function MessagePopup({ currentChat, setCurrentChat, onlineUsers }) {
  const scrollRef = useRef();
  const timeoutRef = useRef(null);
  const [input, setInput] = useState("");
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [showGifs, setShowGifs] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data.type == "text") {
        setArrivalMessage({
          sender: data.sender,
          text: data.text,
          type: "text",
          createdAt: Date.now(),
        });
      } else {
        setArrivalMessage({
          sender: data.sender,
          url: data.url,
          type: "gif",
          createdAt: Date.now(),
        });
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      (currentChat?.conversation.sender._id == arrivalMessage.sender ||
        currentChat?.conversation.receiver._id == arrivalMessage.sender) &&
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

  const sendMessage = async (e) => {
    e.preventDefault();

    if (input !== "") {
      try {
        setMessages((prev) => [...prev, message]);

        clearTimeout(timeoutRef.current);
        setIsTyping(false);
        socket.emit("typing", {
          receiver: currentChat.friend._id,
          typing: false,
        });

        const message = {
          conversationId: currentChat.conversation._id,
          sender: user._id,
          text: input,
          type: "text",
        };

        setInput("");
        await axios.post(`/message`, message);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const sendGif = async (url) => {
    if (url) {
      try {
        setMessages((prev) => [...prev, message]);
        setShowGifs(false);
        const message = {
          conversationId: currentChat.conversation._id,
          sender: user._id,
          url: url,
          type: "gif",
        };

        await axios.post(`/message`, message);
        setInput("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode != 13) {
      socket.emit("typing", {
        receiver: currentChat.friend._id,
        typing: true,
      });

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("typing", {
          receiver: currentChat.friend._id,
          typing: false,
        });
      }, 3000);
    }
  };

  useEffect(() => {
    socket.on("display", (data) => {
      if (data.typing) {
        setIsTyping(true);
      } else setIsTyping(false);
    });
  }, []);

  const displayStatus = () => {
    if (isTyping && onlineUsers.includes(currentChat.friend?._id)) {
      return "is typing...";
    } else if (onlineUsers.includes(currentChat.friend?._id)) {
      return "online";
    } else return "offline";
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, type: "tween" }}
      className="h-screen z-[99999] flex flex-col fixed lg:absolute top-0 lg:top-auto lg:bottom-1 right-0 w-full lg:w-[600px] lg:h-[480px] rounded-md lg:border-t-2 lg:border-l-2 shadow-md bg-primary"
    >
      <div className="flex items-center px-3 py-3 relative space-x-3 border-b-2">
        <div className="relative">
          <div
            className={`absolute -right-0.5 -top-1 ${
              onlineUsers.includes(currentChat.friend?._id)
                ? "bg-[#20da97] border-[2px] border-primary"
                : "bg-transparent"
            } w-3 h-3 rounded-full `}
          ></div>
          <div
            style={{
              backgroundImage: `url(${currentChat.friend?.profilePicture})`,
            }}
            className="w-9 h-9 bg-cover rounded-full"
          ></div>
        </div>
        <div className="flex-1">
          <p className="font-medium">{currentChat.friend?.username}</p>
          <p className={`text-[12.25px] -mt-0.5 text-gray_dark`}>
            {displayStatus()}
          </p>
        </div>
        <IoMdCloseCircle
          size={24}
          color="#1da1f2"
          className="text-xl cursor-pointer"
          onClick={() => setCurrentChat(null)}
        />
      </div>

      <div className="flex-1 flex flex-col py-5 px-3 space-y-3 overflow-auto scrollbar scrollbar-w-0">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`space-y-2 w-48 ${
              message.sender !== currentChat?.friend._id && "self-end"
            }`}
          >
            <Message {...{ message, currentChat }} />
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="bg-secondary p-2 flex items-center rounded-md mx-3 mb-3 relative space-x-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="text-[15px] flex-1 bg-transparent outline-none placeholder-[#A9A9A9]"
          onKeyDown={handleKeyDown}
        />
        <div
          onClick={() => {
            setShowGifs(!showGifs);
          }}
        >
          <AiOutlineGif
            className="text-2xl cursor-pointer"
            color={!showGifs ? "#b8b8b8" : "#1da1f2"}
          />
        </div>

        <button type="submit">
          <BsSendFill color="#1da1f2" />
        </button>
      </form>

      <GIFContainer {...{ sendGif, showGifs }} />
    </motion.div>
  );
}

export default MessagePopup;
