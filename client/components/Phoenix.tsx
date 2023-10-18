import { Socket as PhxSocket } from "phoenix";
import { Dispatch, useEffect, useState, createContext } from "react";

export const SocketContext = createContext<PhxSocket | null>(null);

function setupSocket(socket: PhxSocket, setSocket: Dispatch<PhxSocket>) {
  if (!socket) {
    const URL = "wss://phoenix.aayushsahu.com/socket";
    // const URL = "ws://localhost:4000/socket";
    const phxSocket = new PhxSocket(URL);
    phxSocket.connect();
    setSocket(phxSocket);
  }
}

function teardownSocket(
  socket: PhxSocket,
  setSocket: Dispatch<PhxSocket | null>
) {
  if (socket) {
    socket.disconnect();
    setSocket(null);
  }
}

export function Socket({ children }: { children: any }) {
  const [socket, setSocket] = useState<PhxSocket | null>(null);

  useEffect(() => {
    setupSocket(socket!, setSocket);
    return () => teardownSocket(socket!, setSocket);
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
