import React from 'react'

function Dropdown({ children }) {
  return (
    <div className='text-white absolute w-full right-0 -bottom-12 bg-bodySecondary py-2 px-4 rounded-full shadow-2xl border-2 border-bodyPrimary'>
        {children}
    </div>
  )
}

export default Dropdown