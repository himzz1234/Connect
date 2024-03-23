import axios from "../axios";
import Searchbar from "./Searchbar";
import { CgEnter } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import Notification from "./Notification";
import { AnimatePresence, motion } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user, dispatch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/notification/${user._id}`);
        setNotifications(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();
  }, []);

  const logout = async () => {
    await axios.get("/auth/logout", { withCredentials: true });
    dispatch({ type: "LOGOUT" });

    socket.disconnect();
    socket.on("getUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });

    navigate("/login");
  };

  const unread = notifications.filter((notification) => !notification.isread);
  const displayNotifications = async () => {
    if (showNotifications) {
      const unreadIds = notifications.map((notif) => {
        if (!notif.isread) return notif._id;
      });

      if (unread.length) {
        const res = await axios.put(`/notification/${user._id}`, unreadIds);
        setNotifications(res.data);
      }
    }

    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex items-center py-2 z-30 h-[70px] bg-primary w-full px-6">
      <div className="flex items-center w-full">
        <img
          src="/assets/socialLogo.png"
          width={100}
          height={100}
          className="-ml-6"
        />

        <Searchbar {...{ user }} />

        <div className="relative lg:ml-14">
          <div className="relative">
            {unread.length > 0 && (
              <div className="absolute text-[8px] grid place-content-center -right-2 -top-3 bg-[#fb2f55] text-white border-[3px] border-secondary w-5 h-5 rounded-full">
                <p>{unread.length}</p>
              </div>
            )}
            <div onClick={displayNotifications}>
              <IoMdNotificationsOutline className="text-[17px] lg:text-[20px] cursor-pointer" />
            </div>
          </div>
          <AnimatePresence>
            {showNotifications && notifications.length > 0 && (
              <motion.div
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "tween" }}
                className="absolute scrollbar-none top-8 bg-primary shadow-lg border-2 border-secondary right-0 w-[40vh] lg:w-[360px] h-64 overflow-y-scroll rounded-sm"
              >
                {notifications?.map((notification) => (
                  <Notification key={notification?._id} {...{ notification }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="cursor-pointer relative ml-2 sm:ml-5 py-1.5 rounded-full flex items-center"
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-9 h-9 bg-cover rounded-full"
          ></div>

          {showDropdown && (
            <div className="absolute w-32 right-0 -bottom-12 bg-primary py-2 px-2 rounded-sm shadow-lg border-2">
              <div
                onClick={logout}
                className="flex items-center justify-between"
              >
                <p className="text-sm">Logout</p>
                <CgEnter className="text-red-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
