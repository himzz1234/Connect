import { useContext, useState, useEffect } from "react";
import Feed from "../components/Feed";
import Profile from "../components/Profile";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
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
    <div className="flex flex-col h-full">
      <Header setOnlineUsers={setOnlineUsers} />
      <section className="flex-1 space-y-5 scrollbar scrollbar-none flex flex-col lg:flex-row items-start lg:space-x-4 lg:space-y-0 px-2 py-2 w-full">
        <Profile />
        <Feed />
        <Sidebar onlineUsers={onlineUsers} />
      </section>
    </div>
  );
}

export default Home;
