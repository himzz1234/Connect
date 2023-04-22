import { CgEnter } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { HiUser } from "react-icons/hi";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import { AnimatePresence, motion } from "framer-motion";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function Topbar({ setOnlineUsers }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const { socket } = useContext(SocketContext);
  const { user, dispatch } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("getNotification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });
  }, []);

  useEffect(() => {
    if (debounceSearchTerm) {
      fetchUsers(debounceSearchTerm);
    } else {
      setUsers([]);
    }
  }, [debounceSearchTerm]);

  const displayNotifications = ({ sender, text, type }, index) => {
    console.log(text);
    if (type == 1) {
      return (
        <div
          key={index}
          className={`${
            index > 0 && "border-t-2 border-[#28343e]"
          } flex items-center space-x-3 px-5 py-3`}
        >
          <div
            style={{ backgroundImage: `url(${sender?.profilePicture})` }}
            className="w-8 h-8 bg-cover rounded-full -ml-2"
          ></div>
          <p className="flex-1 text-[13.5px]">
            <span className="font-semibold">{sender.username}</span> liked your
            post
          </p>
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className={`${
            index > 0 && "border-t-2 border-[#28343e]"
          } flex items-center space-x-3 px-5 py-3`}
        >
          <div
            style={{ backgroundImage: `url(${sender?.profilePicture})` }}
            className="w-8 h-8 bg-cover rounded-full -ml-2"
          ></div>
          <p className="flex-1 text-[13.5px]">
            <span className="font-semibold">{sender.username}</span> commented
            on your post: <span className="font-semibold">{text}</span>
          </p>
        </div>
      );
    }
  };

  const fetchUsers = async (username) => {
    const res = await axios.post("/users", {
      userId: user?._id,
    });

    setUsers(
      res.data.filter((user) =>
        user.username.toLowerCase().includes(username.toLowerCase())
      )
    );
  };

  const followUser = async (id) => {
    try {
      await axios.post(`/conversation`, {
        senderId: user?._id,
        receiverId: id,
      });
    } catch (error) {
      console.log(error);
    }

    await axios.put(`/users/follow/${id}`, {
      userId: user?._id,
    });

    window.location.reload();
  };

  const unfollowUser = async (id) => {
    await axios.put(`/users/unfollow/${id}`, {
      userId: user?._id,
    });

    window.location.reload();
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });

    localStorage.removeItem("userToken");
    socket.disconnect();

    socket.on("getUsers", (users) => {
      setOnlineUsers(users.map((user) => user.userId));
    });

    navigate("/login");
  };

  return (
    <div className="sticky flex items-center top-0 left-0 py-2 z-30 h-[90px] bg-bodyPrimary max-w-[600px] md:max-w-[1000px] lg:max-w-[1580px] mx-auto px-6">
      <div className="flex items-center w-full">
        <div className="-ml-4">
          <img
            src="/assets/socialLogo.png"
            alt="logo"
            className="object-contain w-[100px] h-[100px] min-w-[60px] min-h-[60px]"
          />
        </div>

        <div className="flex-1 flex relative">
          <div
            className={`bg-bodySecondary ${
              users.length > 0 ? "rounded-t-md" : "rounded-md"
            } flex items-center lg:px-3 py-2 px-2 w-full md:w-[400px] lg:w-[500px]`}
          >
            <FiSearch color="#707e8b" className="lg:block hidden" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for friend, post or video"
              className="text-[13.5px] md:text-[14px] lg:text-normal bg-transparent text-white flex-1 outline-none placeholder-[#707e8b] lg:ml-2"
            />
          </div>

          <AnimatePresence>
            {users.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, type: "spring" }}
                exit={{ opacity: 0 }}
                className="bg-bodySecondary w-[300px] lg:w-[500px] rounded-b-md text-white absolute top-10 border-t-2 border-bodyPrimary shadow-2xl"
              >
                {users?.map((u, index) => (
                  <div
                    key={u._id}
                    className={`relative flex space-x-3 items-center ${
                      index > 0 &&
                      "before:absolute before:w-full before:h-[1px] before:bg-[#28343e] before:-top-0"
                    }`}
                  >
                    <div className="flex flex-1 items-center space-x-3 py-3 pl-3">
                      <div
                        style={{ backgroundImage: `url(${u?.profilePicture})` }}
                        className="w-9 h-9 bg-cover rounded-full"
                      ></div>
                      <div className="flex-1">
                        <small className="text-[11px] text-[#73899a]">
                          @{u.email?.split("@")[0]}
                        </small>
                        <p className="flex items-center space-x-[0.5px] text-[14px] font-semibold">
                          {u.username}
                        </p>
                      </div>
                    </div>
                    <div>
                      {user?.following.findIndex((f) => f === u._id) > -1 ? (
                        <button
                          onClick={() => unfollowUser(u._id)}
                          className="text-[#1da1f2] text-xs px-3 py-1 rounded-sm"
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={() => followUser(u._id)}
                          className="text-[#1da1f2] text-xs px-3 py-1 rounded-sm"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex items-center space-x-6 lg:space-x-8 text-tabContentColor lg:ml-14">
          <div className="relative hidden md:block">
            <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2 -top-3 bg-[#1094e6] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
              1
            </div>
            <HiUser className="text-[17px] lg:text-[20px]" />
          </div>
          <div className="relative hidden md:block">
            <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2.5 -top-3 bg-[#1094e6] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
              1
            </div>
            <BsChatLeftDotsFill className="text-[17px] lg:text-[20px]" />
          </div>
          <div className="relative">
            {notifications.length > 0 && (
              <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2 -top-3 bg-[#1094e6] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
                {notifications.length}
              </div>
            )}
            <div onClick={() => setShowNotifications(!showNotifications)}>
              <IoNotifications className="text-[17px] lg:text-[20px] cursor-pointer" />
            </div>
          </div>
          <AnimatePresence>
            {showNotifications && notifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, stiffness: 60, type: "spring" }}
                exit={{ opacity: 0, y: -15 }}
                className="absolute top-10 bg-bodySecondary shadow-2xl right-0 w-[360px] rounded-md"
              >
                {notifications?.map((notification, index) =>
                  displayNotifications(notification, index)
                )}
                <button
                  onClick={() => {
                    setNotifications([]);
                    setShowNotifications(false);
                  }}
                  className="bg-[#1094e6] text-center w-full m-2 py-1 text-[15px] rounded-sm"
                >
                  Mark all as read
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="cursor-pointer relative lg:w-32 ml-5 lg:ml-14 lg:px-4 px-1.5 py-1.5 rounded-full bg-[hsl(206,23%,16%)] flex items-center"
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-7 h-7 lg:w-6 lg:h-6 bg-cover rounded-full lg:-ml-2"
          ></div>
          <p className="text-sm hidden lg:block text-[#adbdc4] font-semibold ml-2">
            {user?.username}
          </p>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1, stiffness: 60, type: "spring" }}
                exit={{ opacity: 0, y: -15 }}
                className="text-white absolute w-32 right-0 -bottom-12 bg-bodySecondary py-2 px-4 rounded-full shadow-2xl border-2 border-bodyPrimary"
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
