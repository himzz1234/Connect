import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AiOutlineGif } from "react-icons/ai";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import Message from "./Message";
import GIFContainer from "./GIFContainer";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosClose } from "react-icons/io";

function MessagePopup({ currentChat, setCurrentChat, onlineUsers }) {
  const scrollRef = useRef();
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [showGifs, setShowGifs] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [giphytosend, setGiphyToSend] = useState("");

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setArrivalMessage({
        sender: data.sender,
        url: data.url,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    const { _id: senderId } = currentChat?.conversation.sender,
      { _id: receiverId } = currentChat?.conversation.receiver;

    arrivalMessage &&
      [senderId, receiverId].includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat.conversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `/message/${currentChat.conversation._id}`,
          { withCredentials: true }
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [currentChat]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (inputRef.current?.value || giphytosend) {
      try {
        clearTimeout(timeoutRef.current);
        setIsTyping(false);
        socket.emit("typing", {
          receiver: currentChat.friend._id,
          typing: false,
        });

        const message = {
          conversationId: currentChat.conversation._id,
          sender: user._id,
          text: inputRef.current.value,
          url: giphytosend,
        };

        const res = await axios.post(`/message`, message, {
          withCredentials: true,
        });

        setMessages((prev) => [...prev, res.data]);

        setShowGifs(false);
        setGiphyToSend("");
        inputRef.current.value = "";
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode !== 13) {
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
    } else if (e.keyCode === 13 && !e.shiftKey) {
      sendMessage(e);
    }
  };

  useEffect(() => {
    socket.on("display", (data) => {
      if (data.typing) {
        setIsTyping(true);
      } else setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="h-screen z-[99999] flex flex-col fixed lg:absolute top-0 lg:top-auto lg:bottom-1 right-0 w-full lg:w-[600px] lg:h-[480px] rounded-md lg:border-t-2 lg:border-l-2 shadow-lg bg-primary"
    >
      <div className="flex items-center px-3 py-3 space-x-3 border-b-2">
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
        <p className="font-medium flex-1">{currentChat.friend?.username}</p>
        <IoMdCloseCircle
          size={24}
          color="#1da1f2"
          className="text-xl cursor-pointer"
          onClick={() => setCurrentChat(null)}
        />
      </div>

      <ul className="flex-1 flex flex-col py-5 px-3 overflow-auto scrollbar scrollbar-w-0 w-full">
        <AnimatePresence initial={false} mode="popLayout">
          {messages.map((message) => (
            <motion.li
              layout
              key={message._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 0.2 },
                layout: { type: "spring", bounce: 0.3 },
              }}
              style={{
                originX: message.sender !== currentChat?.friend._id ? 1 : 0,
              }}
            >
              <div>
                <Message {...{ message, currentChat }} />
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        <div
          ref={scrollRef}
          className="w-fit rounded-r-md rounded-t-md bg-secondary"
        >
          {isTyping && (
            <img
              src="/assets/typingindicator.gif"
              width={52}
              height={52}
              alt="typing-indicator"
            />
          )}
        </div>
      </ul>

      <form
        onSubmit={sendMessage}
        className="bg-secondary p-2 flex items-start gap-4 rounded-md mx-3 mb-3"
      >
        {giphytosend && (
          <div className="relative">
            <div
              onClick={() => setGiphyToSend("")}
              className="absolute border-2 border-secondary -top-2 -right-2 bg-accent w-5 h-5 cursor-pointer rounded-full grid place-content-center"
            >
              <IoIosClose color="white" size={20} />
            </div>
            <img
              src={giphytosend}
              alt="giphy-to-send"
              className="w-[140px] h-[140px] object-cover"
            />
          </div>
        )}
        <textarea
          ref={inputRef}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
          className="text-[15px] flex-1 h-full bg-transparent outline-none placeholder-[#A9A9A9] resize-none"
        />
        <div className="flex items-center gap-3">
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
        </div>
      </form>

      <GIFContainer {...{ setGiphyToSend, showGifs }} />
    </motion.div>
  );
}

export default MessagePopup;
