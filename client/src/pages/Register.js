import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      if(password.current.value !== passwordAgain.current.value){
        passwordAgain.current.setCustomValidity("Passwords dont match!")
      } else {
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value
        }

        try{
          await axios.post('http://localhost:8800/api/auth/register', user)
          
          navigate('/login')
        } catch(err){
          console.log(err)
        }
      }
    }
    
    return (
      <div className='flex items-center justify-center h-full text-white'>
          <div className='w-[450px] mr-20'>
            <div className='flex items-center'>
              <img
                src="/assets/socialLogo.png"
                alt="logo"
                width="120"
                height="120"
                className="object-contain -ml-6"
              />
  
              <h1 className='text-5xl font-bold'>Connect</h1>
            </div>
  
            <p className='text-2xl font-semibold leading-[40px]'>Connect with friends and the world around you.</p>
          </div>
  
          <form onSubmit={handleSubmit} className='bg-bodySecondary p-5 w-[450px] h-[450px] flex flex-col rounded-md space-y-5'>
             <div className='space-y-5 flex-1'>
              <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
                <input required ref={username} type='text' placeholder='Username' className='w-full outline-none bg-transparent'/>
              </div>
              <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
                <input required ref={email} type='email' placeholder='Email' className='w-full outline-none bg-transparent'/>
              </div>
              <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
                <input minLength='6' required ref={password} type='password' placeholder='Password' className='w-full outline-none bg-transparent'/>
              </div>
              <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
                <input minLength='6' required ref={passwordAgain} type='password' placeholder='Confirm Password' className='w-full outline-none bg-transparent'/>
              </div>
             </div>
  
             <button type='submit' className='w-full bg-[#139e6b] py-2 rounded-md'>Sign Up</button>
             <Link to="/login">
               <button className='w-full py-2 rounded-md'>Login Into Account</button>
             </Link>
          </form>
      </div>
    )
  }

export default Register