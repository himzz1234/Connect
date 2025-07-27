import React, { useState, useEffect } from "react";
import Notification from "./Notification";
import Dropdown from "./Dropdown";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "../axios";

function Notifications({ user }) {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const list = {
    hidden: {
      maxHeight: 0,
      opacity: 0,
      transition: {
        when: "afterChildren",
        type: "spring",
        bounce: 0.4,
        damping: 20,
        duration: 0.3,
      },
    },

    visible: {
      maxHeight: "260px",
      opacity: 1,
      transition: {
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    socket.on("sendNotiffication", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notification/${user._id}`, {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  const unread = notifications.filter((notification) => !notification.isread);
  const displayNotifications = async () => {
    setShowNotifications(!showNotifications);

    if (showNotifications) {
      const unreadIds = notifications.map((notif) => {
        if (!notif.isread) return notif._id;
      });

      if (unread && unread.length) {
        const res = await axios.put(`/notification/${user._id}`, unreadIds, {
          withCredentials: true,
        });
        setNotifications(res.data);
      }
    }
  };

  return (
    <Dropdown setIsOpen={setShowNotifications}>
      <div className="relative">
        <div className="relative">
          {unread && unread.length > 0 && (
            <div className="absolute text-[8px] grid place-content-center -right-1 -top-2 bg-[#fb2f55] text-white border-[3px] border-secondary w-5 h-5 rounded-full">
              <p>{unread.length}</p>
            </div>
          )}
          <div
            className="bg-secondary w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
            onClick={displayNotifications}
          >
            <IoMdNotificationsOutline className="text-[18px] lg:text-[20px]" />
          </div>
        </div>
        <AnimatePresence>
          {showNotifications && notifications && notifications.length > 0 && (
            <motion.ul
              variants={list}
              exit="hidden"
              initial="hidden"
              animate="visible"
              className="absolute scrollbar-w-0 scrollbar-none top-12 bg-secondary shadow-lg -right-2 w-[40vh] sm:w-[360px] overflow-y-scroll rounded-sm"
            >
              {notifications?.map((notification) => (
                <motion.li key={notification?._id} variants={item}>
                  <Notification {...{ notification }} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </Dropdown>
  );
}

export default Notifications;
