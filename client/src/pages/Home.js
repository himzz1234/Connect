import { useContext, useState, useEffect } from "react";
import Feed from "../layout/Feed";
import Profile from "../layout/Profile";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

function Home() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const container = {
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        type: "tween",
        bounce: 0.4,
      },
    },

    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.075,
        type: "tween",
        bounce: 0.4,
      },
    },
  };

  const containerItem = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user._id);

      socket.on("onlineUsers", (users) => {
        setOnlineUsers(users.map((user) => user.userId));
      });
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header setOnlineUsers={setOnlineUsers} />
      <motion.section
        variants={container}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="flex-1 space-y-3 scrollbar scrollbar-none flex flex-col lg:flex-row items-start lg:space-x-4 lg:space-y-0 px-2 py-2 w-full"
      >
        <motion.div
          variants={containerItem}
          className="order-1 lg:order-1 w-full lg:w-4/12 xl:w-3/12 bg-primary rounded-md px-2 md:px-5 py-2 md:py-6 h-full"
        >
          <Profile />
        </motion.div>
        <motion.div
          variants={containerItem}
          className="order-3 lg:order-2 w-full lg:w-6/12 lg:h-full overflow-y-auto scrollbar scrollbar-w-0"
        >
          <Feed />
        </motion.div>
        <motion.div
          variants={containerItem}
          className="order-2 lg:order-3 lg:relative w-full lg:w-3/12 h-full flex flex-col bg-primary py-1 px-1 md:py-2 md:px-2 rounded-md"
        >
          <Sidebar onlineUsers={onlineUsers} />
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;
