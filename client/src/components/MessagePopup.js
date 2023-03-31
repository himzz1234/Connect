import React, { useState } from 'react'
import { IoIosClose } from 'react-icons/io'
import { MdOpenInNew } from 'react-icons/md'

function MessagePopup() {
  const [ message, setMessage ] = useState('')
  return (
    <div className='flex flex-col absolute bottom-0 right-0 w-[500px] h-96 rounded-tl-md border-4 border-bodyPrimary shadow-2xl bg-bodySecondary'>
        <div className='flex items-center justify-between px-3 py-3 relative after:absolute after:w-full after:h-[2px] after:bg-[#28343e] after:-bottom-1 after:left-0'>
            <p>Messenger</p>
            <MdOpenInNew className='text-xl' color='#1da1f2' />
        </div>
        
        <div className='flex-1 py-5 px-3 space-y-4 overflow-auto scrollbar scrollbar-w-0'>
          <div className='space-y-2 w-48'>
            <div className='bg-[#2b80ff] p-2 rounded-md'>
              <p className='text-[14px]'>This is a message</p>
            </div>
            <p className='text-xs'>1 hour ago</p>
          </div>
          <div className='space-y-2 w-48'>
            <div className='bg-[#2b80ff] p-2 rounded-md'>
              <p className='text-[14px]'>This is a message</p>
            </div>
            <p className='text-xs'>1 hour ago</p>
          </div>
          <div className='space-y-2 w-48'>
            <div className='bg-[#2b80ff] p-2 rounded-md'>
              <p className='text-[14px]'>This is a message</p>
            </div>
            <p className='text-xs'>1 hour ago</p>
          </div>
        </div>

        <div className='bg-[#28343e] p-2 flex items-center rounded-md m-3'>
          <input value={message} onChange={(e) => setMessage(e.target.value)} type='text' placeholder="Type a message..." className="text-[16px] flex-1 bg-transparent outline-none placeholder-[#617484]"/>
        </div>
    </div>
  )
}

export default MessagePopup