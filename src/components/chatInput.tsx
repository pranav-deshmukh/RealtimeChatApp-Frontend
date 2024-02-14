'use client'

import axios from 'axios'
import { FC, useRef, useState, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import {Button} from '../components/ui/button'
// import {io} from "socket.io-client";
import { useSocketContext } from "@/context";

interface ChatInputProps {
  chatfullId: string,
  chatPartner: string
}

const ChatInput: FC<ChatInputProps> = ({chatfullId, chatPartner}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const {socket, onlineUsers, message, setMessage} = useSocketContext();


  const sendMessage = async () => {
    if(!input) return
    setIsLoading(true)
    if (socket !== null) {
      console.log(chatPartner,"hello", chatfullId)
      socket.emit("sendMessage",{text: input, senderId:chatPartner, chatId:chatfullId, _id: Date.now().toString(), createdAt:Date.now()})
    }
    setMessage({text:input, senderId:chatPartner, chatId:chatfullId, _id: Date.now().toString(), createdAt:Date.now()})
    
    try {
      await axios.post('http://localhost:3000/api/v1/messages/', { text: input, chatId:chatfullId, senderId:chatPartner })
      setInput('')

      textareaRef.current?.focus()
    } catch {
      // toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

      //send message

    useEffect(() => {
    
  }, [input,socket, chatPartner, chatfullId]);

  useEffect(() => {
  console.log("message", message);
}, [message]);


  return (
    <div className='border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0'>
      <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
        <TextareaAutosize
          ref={textareaRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        //   placeholder={`Message ${chatPartner.name}`}
          className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
        />

        <div
          onClick={() => textareaRef.current?.focus()}
          className='py-2'
          aria-hidden='true'>
          <div className='py-px'>
            <div className='h-9' />
          </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
          <div className='flex-shrin-0'>
            <Button 
            isLoading={isLoading} onClick={sendMessage} 
            type='submit'>
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
