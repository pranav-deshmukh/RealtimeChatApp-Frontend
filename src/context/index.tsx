import { createContext, useState, useContext, useEffect } from "react";

import { io } from "socket.io-client";
const SocketContext = createContext();

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode
}){
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        const socket = io("http://localhost:4000");

        setSocket(socket)

        socket.on("getOnlineUsers", (users)=>{
            setOnlineUsers(users)
        })

        return ()=>socket.close();
    },[])

    return (
        <SocketContext.Provider value={{socket, onlineUsers, message, setMessage}}>
            {children}
        </SocketContext.Provider>
    )
}

export function useSocketContext(){
    return useContext(SocketContext)
}