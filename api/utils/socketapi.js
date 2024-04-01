let io;
const connectedUsers = [];

const initializeSocket = (socketIO) => {
  io = socketIO;

  io.on("connection", handleConnection);
};

const handleConnection = (socket) => {
  try {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("onlineUsers", connectedUsers);
    });

    socket.on("typing", handleTyping);

    socket.on("disconnect", () => {
      removeUser(socket.id);

      io.emit("onlineUsers", connectedUsers);
    });
  } catch (error) {
    console.error("Error handling connection:", error);
  }
};

const addUser = (userId, socketId) => {
  if (!connectedUsers.some((user) => user.userId === userId)) {
    connectedUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  const index = connectedUsers.findIndex((user) => user.socketId === socketId);
  if (index !== -1) {
    connectedUsers.splice(index, 1);
  }
};

const handleTyping = (data) => {
  try {
    const receiver = connectedUsers.find(
      (user) => user.userId == data.receiver
    );
    if (!receiver) {
      return;
    }

    const receiverSocketId = receiver.socketId;
    io.to(receiverSocketId).emit("display", data);
  } catch (error) {
    console.error("Error handling typing event:", error);
  }
};

const getConnectedUsers = () => {
  return connectedUsers;
};

module.exports = {
  initializeSocket,
  getConnectedUsers,
};
