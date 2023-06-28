import { useContext, useState, useEffect } from "react";
import Feed from "../components/Feed";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user._id);

      socket.on("getUsers", (users) => {
        setOnlineUsers(users.map((user) => user.userId));
      });
    }
  }, []);

  return (
    <div className="relative">
      <Topbar setOnlineUsers={setOnlineUsers} />
      <section className="mb-5 lg:mb-0 space-y-5 scrollbar scrollbar-none flex flex-col lg:flex-row items-start text-white lg:space-x-8 lg:space-y-0 max-w-[600px] px-5 md:max-w-[1000px] lg:max-w-[1580px] mx-auto">
        <Profile />
        <Feed />
        <Sidebar onlineUsers={onlineUsers} />
      </section>
    </div>
  );
}

export default Home;
