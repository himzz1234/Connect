import React from 'react'

function FriendBlock({ friend }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="absolute -right-0.5 -top-1 bg-[#20da97] w-3 h-3 rounded-full border-[2px] border-bodyPrimary"></div>
        <div style={{backgroundImage: `url(${friend?.profilePicture})`}} className="w-8 h-8 bg-cover rounded-full"></div>
      </div>
      <p className="text-[14.5px] ml-2">{friend?.username}</p>
    </div>
  )
}

export default FriendBlock