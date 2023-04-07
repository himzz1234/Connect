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
  }, [onlineUsers]);

  return (
    <div className="">
      <Topbar setOnlineUsers={setOnlineUsers} />
      <section className="scrollbar scrollbar-w-0 flex items-start text-white space-x-8 max-w-[1480px] mx-auto">
        <Profile />
        <Feed />
        <Sidebar onlineUsers={onlineUsers} />
      </section>
    </div>
  );
}

export default Home;
