import { createContext, useContext, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const INITIAL_STATE = {
  socket: undefined,
};

export const SocketContext = createContext(INITIAL_STATE);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useMemo(() => {
    setSocket(io(process.env.REACT_APP_API_ENDPOINT));
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
