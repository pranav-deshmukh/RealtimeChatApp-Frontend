"use client";
import axios from "axios";

import { ChangeEvent, useState, FC, useEffect } from "react";

interface FriendsProps {
  friends: string[];
}

export const SearchBar = ({ friends }:FriendsProps) => {
  const [query, setQuery] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<string[]>(friends);
  const [createChatWith, setCreateChatWith] = useState<string>('');
  const [userMail, setUserMail] = useState('');

  const handleClick = (friend:string)=>{
    setCreateChatWith(friend)
  }

  useEffect(()=>{
    const fetchData = async ()=>{
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        const response1 = await axios.post('http://localhost:3000/api/v1/users/getUser', { token: storedToken }, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUserMail(response1.data.email);
        const response2 = await axios.post(`http://localhost:3000/api/v1/chats/`,{
          email1:userMail,
          email2:createChatWith
        },{
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log(response2);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  },[createChatWith])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const lowercasedQuery = value.toLowerCase();
    const newFilteredFriends = friends.filter(friend =>
      friend.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredFriends(newFilteredFriends);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search friends..."
        className="w-full rounded-sm"
      />
      {
        query&&
      <ul className="z-30 absolute bg-white w-full border rounded-sm">
        {filteredFriends.map((friend, index) => (
          <li className="mt-2 p-2 text-sm " key={index} onClick={()=>handleClick(friend)}>{friend}</li>
        ))}
      </ul>
      }
    </div>
  );
};

