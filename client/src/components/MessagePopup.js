import React, { useContext, useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AiOutlineGif } from "react-icons/ai";
import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import Message from "./Message";
import GIFContainer from "./GIFContainer";

function MessagePopup({ currentChat, setCurrentChat, onlineUsers }) {
  const scrollRef = useRef();
  const [input, setInput] = useState("");
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [showGifs, setShowGifs] = useState(false);
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

        const message = {
          conversationId: currentChat.conversation._id,
          sender: user._id,
          text: input,
          type: "text",
          url: "",
          status: "Sent",
          img: "",
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

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen z-[99999] flex flex-col fixed lg:absolute top-0 lg:top-auto lg:bottom-1 right-0 w-full lg:w-[500px] lg:h-[500px] rounded-md lg:border-t-2 lg:border-l-2 shadow-md bg-bodyPrimary">
      <div className="flex items-center px-3 py-3 relative space-x-3 border-b-2">
        <div className="relative">
          <div
            className={`absolute -right-0.5 -top-1 ${
              onlineUsers.includes(currentChat.friend?._id)
                ? "bg-[#20da97] border-[2px] border-bodyPrimary"
                : "bg-transparent"
            } w-3 h-3 rounded-full `}
          ></div>
          <div
            style={{
              backgroundImage: `url(${currentChat.friend?.profilePicture})`,
            }}
            className="w-8 h-8 bg-cover rounded-full"
          ></div>
        </div>
        <p className="flex-1">{currentChat.friend?.username}</p>
        <IoMdCloseCircle
          size={24}
          className="text-xl cursor-pointer"
          color="#1da1f2"
          onClick={() => setCurrentChat(null)}
        />
      </div>

      <div className="flex-1 flex flex-col py-5 px-3 space-y-4 overflow-auto scrollbar scrollbar-w-0">
        {messages.map((message, index) => (
          <div
            key={index}
            ref={scrollRef}
            className={`space-y-2 w-48 ${
              message.sender !== currentChat?.friend._id && "self-end"
            }`}
          >
            <Message
              message={message}
              index={index}
              currentChat={currentChat}
            />
          </div>
        ))}
      </div>

      <form
        onSubmit={sendMessage}
        className="bg-bodySecondary p-2 flex items-center rounded-md m-3 relative space-x-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="text-[15px] flex-1 bg-transparent outline-none placeholder-[#A9A9A9]"
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
    </div>
  );
}

export default MessagePopup;
