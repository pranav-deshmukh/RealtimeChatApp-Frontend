import axios from 'axios';
import { Check, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { Toaster, toast } from "sonner";

interface FriendRequestsProps {
  acceptFriendRequests: string[];
  sessionId: string;
}

interface MyResponse {
  status: string;
  message: string;
}


const FriendRequests: FC<FriendRequestsProps> = ({ acceptFriendRequests, sessionId }) => {
      const [errorTimeout, setErrorTimeout] = useState(null);
  const router = useRouter();

  const acceptFriend = async (senderEmail: string) => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const response = await axios.post<MyResponse>('http://localhost:3000/api/v1/users/acceptFriendRequest', { email: senderEmail, token: storedToken }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
  toast.success(response.data.message);
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
  const response = error.response;
  toast.error(`Error: ${response.data.message}`);
  console.error('Error accepting friend request:', error);
}

  };

  const denyFriend = async (senderEmail: string) => {
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  const response = await axios.post<MyResponse>('http://localhost:3000/api/v1/users/denyFriendRequest', { email: senderEmail, token: storedToken }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
  toast.success(response.data.message);
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
  const response = error.response;
  toast.error(`Error: ${response.data.message}`);
  console.error('Error declying friend request:', error);
}

  };



  return (
    <>
    <Toaster richColors closeButton position="top-right" theme="light" />
      {acceptFriendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        acceptFriendRequests.map((senderEmail) => (
          <div key={senderEmail} className='flex gap-4 items-center'>
            <UserPlus className='text-black' />
            <p className='font-medium text-lg'>{senderEmail}</p>
            <button
              onClick={() => acceptFriend(senderEmail)}
              aria-label='accept friend'
              className='w-6 h-6 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>

            <button
              onClick={() => denyFriend(senderEmail)}
              aria-label='deny friend'
              className='w-6 h-6 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
              <X className='font-semibold text-white w-3/4 h-3/4' />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
