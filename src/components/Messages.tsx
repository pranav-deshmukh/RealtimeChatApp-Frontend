import { FC, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { cn } from "@/lib/utils";
import { io } from "socket.io-client";
import { useSocketContext } from "@/context";
import { format } from 'date-fns'

interface MessagesProps {
  chatfullId: string,
  chatPartner: string
}

interface Message {
  chatId: string,
  senderId: string,
  text: string,
  _id: string,
}

const Messages: FC<MessagesProps> = ({ chatfullId, chatPartner }) => {
  const [messages, setMessages] = useState([]);
  const [doto, setDoto] = useState('');
  const {socket, onlineUsers, message} = useSocketContext();

  // useEffect(() => {
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/messages/${chatfullId}`);
        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();

    // if (socket !== null) {
    //   console.log("chatfullid", chatfullId);
    //   socket.on("getMessage", (res) => {
    //     console.log(res);
    //     if (chatfullId !== res.chatId) return;

    //     setDoto(res)
    //     console.log(doto)
    //   });

    //   return () => {
    //     socket.off("getMessage");
    //   };
    // }
  }, [chatfullId]);
  

  useEffect(()=>{
    if (socket==null) return;

    socket.on("getMessage", (res)=>{
      // if (chatfullId !== res.chatId) return;

      setMessages((prev)=> [...prev, res])
      console.log("response",res)
    })

    return () => {
        socket.off("getMessage");
      };
  },[socket, messages, chatfullId])

  useEffect(() => {
  if (message && message.chatId === chatfullId) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }
}, [message, chatfullId]); 



  const scrollDownRef = useRef<HTMLDivElement | null>(null);

    const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }

  return (
    <div id='messages' className='flex h-full flex-1 flex-col gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      <div ref={scrollDownRef} />

      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === chatPartner;
        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div
            className='chat-message'
            key={`${message._id}`}>
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}>
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2',
                  {
                    'order-1 items-end': isCurrentUser,
                    'order-2 items-start': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('px-4 py-2 rounded-lg inline-block', {
                    'bg-indigo-600 text-white': isCurrentUser,
                    'bg-gray-200 text-gray-900': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  {message.text}{' '}
                  <span className='ml-2 text-xs text-gray-400'>
                    {formatTimestamp(message.createdAt)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                {/* <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                /> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
