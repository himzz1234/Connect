import React, { useContext, useRef } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Login() {
  const email = useRef()
  const password = useRef()
  const navigate = useNavigate()
  
  const {user, isFetching, error, dispatch} = useContext(AuthContext)
  const handleClick = async (e) => {
    e.preventDefault()

    dispatch({ type: "LOGIN_START" })
    try{
      const res = await axios.post("http://localhost:8800/api/auth/login", { email: email.current.value, password: password.current.value })
      localStorage.setItem('userToken', res.data.token)
        
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user})
    } catch(err){
      dispatch({ type: "LOGIN_FAILURE", payload: err })
    }
  }
  
  return (
    <div className='flex items-center justify-center h-full text-white'>
        <div className='mr-20 w-[450px]'>
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

        <form onSubmit={handleClick} className='bg-bodySecondary p-5 w-[450px] h-[400px] flex flex-col rounded-md space-y-5'>
           <div className='space-y-5 flex-1'>
            <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
              <input required ref={email} type='email' placeholder='Email' className='w-full outline-none bg-transparent'/>
            </div>
            <div className='bg-[#28343e] w-full rounded-md px-3 py-3'>
              <input required ref={password} minLength='6' type='password' placeholder='Password' className='w-full outline-none bg-transparent'/>
            </div>

            <p className='py-1 text-sm cursor-pointer'>Forgot Password?</p>
           </div>

           <button disabled={isFetching} className='w-full bg-[#139e6b] py-2 rounded-md flex items-center justify-center'>{isFetching ? <ReactLoading type="spin" color="white" height={20} width={20} /> : "Log In"}</button>
           <Link to="/register">
              <button disabled={isFetching} className='w-full py-2 rounded-md flex items-center justify-center'>{isFetching ? <ReactLoading type="spin" color="white" height={20} width={20} /> : "Create A New Account"}</button>
           </Link>
        </form>

        <ToastContainer />
    </div>
  )
}

export default Login