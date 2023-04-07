import { CgEnter } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";
import { HiUser } from "react-icons/hi";
import { BsChatLeftDotsFill } from "react-icons/bs";
import { IoNotifications } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
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

  useEffect(() => {
    if (debounceSearchTerm) {
      fetchUsers(debounceSearchTerm);
    } else {
      setUsers([]);
    }
  }, [debounceSearchTerm]);

  const fetchUsers = async (username) => {
    const res = await axios.post("http://localhost:8800/api/users", {
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
      await axios.post(`http://localhost:8800/api/conversation`, {
        senderId: user?._id,
        receiverId: id,
      });
    } catch (error) {
      console.log(error);
    }

    await axios.put(`http://localhost:8800/api/users/follow/${id}`, {
      userId: user?._id,
    });

    window.location.reload();
  };

  const unfollowUser = async (id) => {
    await axios.put(`http://localhost:8800/api/users/unfollow/${id}`, {
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
    <div className="sticky top-0 left-0 z-30 bg-bodyPrimary w-full px-6">
      <div className="flex items-center">
        <div className="-ml-4">
          <img
            src="/assets/socialLogo.png"
            alt="logo"
            width="100"
            height="100"
            className="object-contain"
          />
        </div>

        <div className="flex-1 flex relative">
          <div
            className={`bg-bodySecondary ${
              users.length > 0 ? "rounded-t-md" : "rounded-md"
            } flex items-center px-3 py-2 w-[500px]`}
          >
            <FiSearch color="#707e8b" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for friend, post or video"
              className="bg-transparent text-white flex-1 outline-none placeholder-[#707e8b] ml-2"
            />
          </div>

          {users.length > 0 && (
            <div className="bg-bodySecondary w-[500px] rounded-b-md text-white absolute top-10 border-t-2 border-bodyPrimary shadow-2xl">
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
                      <p className="flex items-center space-x-[0.5px] text-[14px]">
                        {u.username.split("").map((str, index) => {
                          if (
                            debounceSearchTerm
                              .toLowerCase()
                              .includes(str.toLowerCase())
                          ) {
                            return (
                              <span key={index} className="font-bold">
                                {str}
                              </span>
                            );
                          } else
                            return (
                              <span key={index} className="text-[#efefef]">
                                {str}
                              </span>
                            );
                        })}
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
            </div>
          )}
        </div>

        <div className="flex items-center space-x-8 text-tabContentColor ml-14">
          <div className="relative">
            <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2 -top-3 bg-[#1da1f2] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
              1
            </div>
            <HiUser className="text-[20px]" />
          </div>
          <div className="relative">
            <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2.5 -top-3 bg-[#1da1f2] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
              1
            </div>
            <BsChatLeftDotsFill className="text-[20px]" />
          </div>
          <div className="relative">
            <div className="absolute text-white font-semibold text-[8px] grid place-content-center -right-2 -top-3 bg-[#1da1f2] border-[3px] border-bodySecondary w-5 h-5 rounded-full">
              1
            </div>
            <IoNotifications className="text-[20px]" />
          </div>
        </div>

        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="cursor-pointer relative ml-14 px-4 py-1.5 rounded-full bg-[hsl(206,23%,16%)] flex items-center"
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-6 h-6 bg-cover rounded-full -ml-2"
          ></div>
          <p className="text-sm text-[#adbdc4] font-semibold ml-2">
            {user?.username}
          </p>

          {showDropdown && (
            <div className="animate__animated animate__flipInX text-white absolute w-full right-0 -bottom-12 bg-bodySecondary py-2 px-4 rounded-full shadow-2xl border-2 border-bodyPrimary">
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

export default Topbar;
