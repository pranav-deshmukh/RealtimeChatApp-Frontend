"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import { useSocketContext } from "@/context";
import Loading from "@/app/(dashboard)/dashboard/requests/loading"; 
import { Divide } from "lucide-react";


export default function AllChats({ userID }) {
  const [chatsArr, setChatsArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {socket, onlineUsers} = useSocketContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/chats/${userID}`);
        console.log("All chats",response);

        setChatsArr(response.data.map(chat => chat.members.find(member => member.userId !== userID)));
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
        const response = error.response;
        if (response) {
          const errorMessage = response.data.message || "An unknown error occurred";
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  const handleChatClick = (memberID:string) => {
    router.push(`/dashboard/chat/${memberID}`);
  };
  console.log("UsersOnlline", onlineUsers)

  return (
    <>
      {loading ? (
        <Loading />
      ) : userID ? (
        <ul role='list' className='h-[15rem] overflow-y-auto -mx-2 space-y-1 border-b-2 '>
          {chatsArr.length>0? chatsArr.map((member, index) => (
            <li key={index} className="w-[90%]">
              <button
                onClick={() => handleChatClick(member.userId)}
                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-100 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full'>
                {member.name}
              <span className="text-[8px]">{
                onlineUsers?.some((user)=>user.userId === member.userId) ? "user-online" : ""
              }</span>
              <div className={onlineUsers?.some((user)=>user.userId === member.userId) ? "w-3 h-3 bg-green-600 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md" : ""}></div>
              </button>
            </li>
            
          )):<p className="text-xs font-semibold leading-6 text-gray-500 ml-2">No chats found...</p>}
        </ul>
      ) : null}
    </>
  );
}
