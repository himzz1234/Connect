import { CgEnter } from "react-icons/cg";
import { IoMdNotificationsOutline } from "react-icons/io";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import Searchbar from "./Searchbar";
import Notification from "./Notification";

function Topbar({ setOnlineUsers }) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user, dispatch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // useEffect(() => {
  //   socket.on("getNotification", (data) => {
  //     console.log(data);
  //     setNotifications((prev) => [...prev, data]);
  //   });
  // }, []);

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
    const res = await axios.get("/auth/logout", { withCredentials: true });
    dispatch({ type: "LOGOUT" });
    socket.disconnect();

    // socket.on("getUsers", (users) => {
    //   setOnlineUsers(users.map((user) => user.userId));
    // });

    navigate("/");
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
    <div className="sticky flex items-center top-0 left-0 py-2 z-30 h-[70px] bg-bodyPrimary max-w-[600px] md:max-w-[1000px] lg:max-w-[1580px] mx-auto px-6">
      <div className="flex items-center w-full">
        <img
          src="/assets/socialLogo.png"
          width={100}
          height={100}
          className="-ml-6"
        />

        <Searchbar {...{ user }} />

        <div className="relative flex items-center space-x-4 sm:space-x-6 lg:space-x-8 text-black lg:ml-14">
          <div className="relative">
            {unread.length > 0 && (
              <div className="absolute text-[8px] grid place-content-center -right-2 -top-3 bg-[#fb2f55] text-white border-[3px] border-bodySecondary w-5 h-5 rounded-full">
                <p>{unread.length}</p>
              </div>
            )}
            <div onClick={displayNotifications}>
              <IoMdNotificationsOutline className="text-[17px] lg:text-[20px] cursor-pointer" />
            </div>
          </div>
          <AnimatePresence>
            {showNotifications && notifications.length > 0 && (
              <motion.div className="absolute scrollbar-none top-8 bg-bodyPrimary shadow-xl border-2 border-bodySecondary right-0 w-[40vh] lg:w-[360px] h-64 overflow-y-scroll rounded-sm">
                {notifications?.map((notification, index) => (
                  <Notification key={index} {...{ notification }} />
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

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, stiffness: 100, type: "spring" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-black absolute w-32 right-0 -bottom-12 bg-bodyPrimary py-2 px-2 rounded-sm shadow-lg border-2"
              >
                <div
                  onClick={logout}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm">Logout</p>
                  <CgEnter className="text-red-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
