'use client'

import { Loader2, LogOut } from 'lucide-react'
// import { signOut } from 'next-auth/react'
import { ButtonHTMLAttributes, FC, useState } from 'react'
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast'
import {Button} from "@/components/ui/button"


interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false)

  const signOut = async() => {
    if (localStorage.getItem("jwt")) {
      console.log("signOut");
      localStorage.removeItem("jwt");
    }
    setTimeout(()=>{

      router.push('/');
    },1500)
  };

  return (
    <Button
      {...props}
      variant='ghost'
      onClick={async () => {
        setIsSigningOut(true)
        console.log("sign out")
        try {
          await signOut()
        } catch (error) {
          toast.error('There was a problem signing out')
        } finally {
          // setIsSigningOut(false)
        }
      }}>
      {isSigningOut ? (
        <Loader2 className='animate-spin h-4 w-4' />
      ) : (
        <LogOut className='w-4 h-4' />
      )}
    </Button>
  )
}

export default SignOutButton
