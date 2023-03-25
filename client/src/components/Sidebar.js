import FriendBlock from "./FriendBlock";
import { AiOutlinePlus } from 'react-icons/ai'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MessagePopup from "./MessagePopup";

function Rsidebar() {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState([])
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(`http://localhost:8800/api/users/friends/${user._id}`)
        setFriends(friendsList.data)
      } catch(err) {
        console.log(err)
      }
    }

    getFriends()
  }, [user._id])

  return (
    <div className="relative w-3/12 h-[600px] flex flex-col bg-bodySecondary py-5 px-5 rounded-md">
      <div className="space-y-5 flex-1">
        {friends.map((friend) => (
          <FriendBlock key={friend._id} friend={friend} />
        ))}
      </div>

      <div className="bg-[#28343e] py-2 px-3 rounded-md flex items-center">
        <input type='text' placeholder="Search for friends" className="flex-1 bg-transparent outline-none placeholder-[#617484]"/>
        <div className="bg-[#1da1f2] rounded-full w-5 h-5 flex items-center justify-center">
          <AiOutlinePlus color='white' className="text-[14px]"/>
        </div>
      </div>
      
      <MessagePopup />
    </div>
  );
}

export default Rsidebar;
