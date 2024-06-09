"use client"

import Link from "next/link";
import { FC, ReactNode, useEffect, useState } from "react";
import { Icon, Icons } from "@/components/Icons";
import { Image } from "lucide-react";
import SignOutButton from "@/components/SignOutButton";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from "sonner";

import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import AllChats from "@/components/AllChats";
import {io} from "socket.io-client";
import { useSocketContext } from "@/context";
import { SearchBar } from "@/components/SearchBar";



interface LayoutProps {
  children: ReactNode;
}

interface MyResponse {
  status: string;
  userId: string;
  email: string;
  name: string;
  friendRequests:number
  friends:[]
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];



const Layout: FC<LayoutProps> = ({ children }) => {
    const [errorTimeout, setErrorTimeout] = useState(null);
  const router = useRouter();
  const handleReload = () => {
    router.refresh();
  };
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [friendRequests, setFriendRequests] = useState(0);
  const [friends, setFriends] = useState([]);
  const {socket, onlineUsers} = useSocketContext();


  // useEffect(()=>{
  //   const newSocket = io("http://localhost:4000");
  //   setSocket(newSocket);
  //   // console.log("Socket connected:", newSocket.id); 

  //   return ()=>{
  //     newSocket.disconnect();
  //   }
  // },[])

  useEffect(()=>{
    console.log("socket",socket)
    console.log(onlineUsers)
    if(socket===null) return
    socket.emit("addNewUser", userId)
  },[socket, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        const response = await axios.post<MyResponse>('http://localhost:3000/api/v1/users/getUser', { token: storedToken }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log("User data",response.data);
        setUserId(response.data.userId);
        setUserName(response.data.name);
        setEmail(response.data.email);
        setFriendRequests(response.data.friendRequests);
        setFriends(response.data.friends);
        // console.log('userId',response.data.userId)

    // console.log("Socket connected:", newSocket.id); 
    
    // return ()=>{
    //   newSocket.disconnect();
    // }
    // console.log(friendRequests)

        
      } catch (error) {
        if(axios.isAxiosError(error)){
          const response = error.response;
          if(response){
            const errorMessage = (response.data).message|| "An unknown error occured"
            toast.error(`Error: ${errorMessage}`);
            if(response.data.status=="fail"){

                  const timeoutId = setTimeout(() => {
                void router.push("/");
              }, 2000);
              setErrorTimeout(timeoutId)
            }
          }
          }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  // console.log("Online Users:", onlineUsers)

  return (
    
    <div className="w-full flex h-screen">
      <Toaster richColors closeButton position="top-right" theme="light" />
      <div className="hidden md:flex h-full w-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>
        <div>
          <SearchBar friends={friends}/>
        </div>
        <div className="text-xs font-semibold leading-6 text-gray-400">
          Your chats
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <AllChats userID={userId} />

            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>

              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li onClick={handleReload}>
                    <FriendRequestSidebarOptions
                    sessionId={""}
                    initialUnseenRequestCount={friendRequests}/>
                </li>

              </ul>
            </li>

            <li className="-mx-6 mt-auto flex items-center">
                <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                 <div className='relative h-8 w-8 bg-gray-50'>
                    {/* <Image
                    // fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    alt='Your profile picture'
                  /> */}
                 </div>
                  
                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{userName}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                   {email}
                  </span>
                </div>
                

                </div>
                <SignOutButton className='h-full aspect-square' />
            </li>

          </ul>
        </nav>
      </div>
      <aside className='max-h-screen container py-16 md:py-12 w-full'>
        {children}
      </aside>
    </div>
  );
};

export default Layout;
