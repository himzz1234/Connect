let io;
const connectedUsers = [];

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

const initializeSocket = (socketIO) => {
  io = socketIO;

  io.on("connection", (socket) => {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", connectedUsers);
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", connectedUsers);
    });
  });
};

const getConnectedUsers = () => {
  return connectedUsers;
};

module.exports = {
  initializeSocket,
  getConnectedUsers,
};
