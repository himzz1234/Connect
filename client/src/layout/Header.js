import axios from "../axios";
import Searchbar from "../components/Searchbar";
import { CgEnter } from "react-icons/cg";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AnimatePresence, motion } from "framer-motion";
import Dropdown from "../components/Dropdown";
import Notifications from "../components/Notifications";

function Header({ setOnlineUsers }) {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user, dispatch } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const logout = async () => {
    await axios.post("/auth/logout", {}, { withCredentials: true });
    dispatch({ type: "LOGOUT" });

    socket.disconnect();
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });

    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 70 }}
      transition={{ duration: 0.2, type: "tween" }}
      className="flex items-center py-2 z-30 bg-primary w-full px-2 sm:px-6"
    >
      <div className="flex items-center w-full">
        <picture className="-ml-5 sm:-ml-8">
          <source
            srcSet="/assets/socialLogo.png"
            media="(max-width: 992px)"
            width={95}
            height={95}
          ></source>
          <img
            src="/assets/socialLogo.png"
            alt="logo"
            width={100}
            height={100}
          />
        </picture>

        <Searchbar {...{ user }} />

        <Notifications {...{ user }} />

        <Dropdown setIsOpen={setShowDropdown}>
          <div
            onClick={() => setShowDropdown((prev) => !prev)}
            className="cursor-pointer relative ml-2 sm:ml-5 py-1.5 rounded-full flex items-center"
          >
            <div
              style={{ backgroundImage: `url(${user?.profilePicture})` }}
              className="w-9 h-9 bg-cover rounded-full"
            ></div>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    type: "spring",
                    bounce: 0.4,
                    damping: 20,
                    duration: 0.3,
                  }}
                  className="absolute w-32 right-0 top-14 bg-secondary rounded-sm p-1 shadow-lg border-2"
                >
                  <div
                    onClick={logout}
                    className="flex items-center justify-between transition-all duration:150 p-1"
                  >
                    <p className="text-sm">Logout</p>
                    <CgEnter className="text-red-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Dropdown>
      </div>
    </motion.div>
  );
}

export default Header;
