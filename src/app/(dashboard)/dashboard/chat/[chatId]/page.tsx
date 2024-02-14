"use client";

import { FC, useEffect, useState } from "react";
import ChatInput from "@/components/chatInput";
import axios from 'axios';
import { Toaster, toast } from "sonner";
import { useParams } from 'next/navigation';
import Messages from "@/components/Messages";

interface PageProps {
  params: {
    firstId: string;
    secondId: string;
  };
}

const Page: FC<PageProps> = ({ params }: PageProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  console.log(chatId);
  const [chatData, setChatData] = useState<any>(null);
  const [chatfullId, setChatFullId] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [friendRequests, setFriendRequests] = useState(0);
  const [targetUserEmail, setTargetUserEmail] = useState('');
  const [targetUserName, setTargetUserName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        const response = await axios.post('http://localhost:3000/api/v1/users/getUser', { token: storedToken }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setUserId(response.data.userId);
        setUserName(response.data.name);
        setEmail(response.data.email);
        setFriendRequests(response.data.friendRequests);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const response = error.response;
          if (response) {
            const errorMessage = (response.data).message || "An unknown error occurred";
            toast.error(`Error: ${errorMessage}`);
          }
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/chats/find/${userId}/${chatId}`);
        const data = response.data;
        setChatData(data);
        setChatFullId(data.chat._id);
        setTargetUserEmail(data.targetUserDetails.targetUserEmail);
        setTargetUserName(data.targetUserDetails.targetUserName);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();
  }, [userId, chatId]);

  if (!chatData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
      {/* ... existing code ... */}
      <div className='flex flex-col leading-tight'>
        <div className='text-xl flex items-center'>
          <span className='text-gray-700 mr-3 font-semibold'>{targetUserName}</span>
        </div>
        <span className='text-sm text-gray-600'>{targetUserEmail}</span>
      </div>
      <Messages chatfullId={chatfullId} chatPartner={chatId} />
      <ChatInput chatfullId={chatfullId} chatPartner={chatId} />
    </div>
  );
};

export default Page;
