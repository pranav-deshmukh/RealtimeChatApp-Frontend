"use client";

import { ChangeEvent, useState, FC } from "react";

interface FriendsProps {
  friends: string[];
}

export const SearchBar = ({ friends }:FriendsProps) => {
  const [query, setQuery] = useState<string>("");
  const [filteredFriends, setFilteredFriends] = useState<string[]>(friends);

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
    <div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search friends..."
      />
      {
        query&&
      <ul>
        {filteredFriends.map((friend, index) => (
          <li key={index}>{friend}</li>
        ))}
      </ul>
      }
    </div>
  );
};

