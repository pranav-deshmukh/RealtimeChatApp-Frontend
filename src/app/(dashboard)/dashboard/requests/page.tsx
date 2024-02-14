"use client"

import FriendRequests from '@/components/FriendRequests';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Toaster, toast } from 'sonner';
import { useState, useEffect } from 'react';

const storedToken =
  typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

const Page = () => {
  const router = useRouter();
  const [acceptFriendRequests, setAcceptFriendRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/api/v1/users/viewFriendRequests',
          { token: storedToken }
        );

        console.log(response.data);

        setAcceptFriendRequests(response.data.acceptFriendRequests);
        router.refresh()
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []); 



  return (
    <main className='pt-8'>
      <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
      <div className='flex flex-col gap-4'>
        <FriendRequests acceptFriendRequests={acceptFriendRequests} sessionId={''} />
      </div>
    </main>
  );
};

export default Page;
