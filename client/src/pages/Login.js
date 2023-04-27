import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axios";
import { SocketContext } from "../context/SocketContext";

function Login() {
  const email = useRef();
  const password = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const notify = (message, type) => {
    if (type === "error") {
      toast.error(message, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.success(message, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const { isFetching, dispatch } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  
  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });
      localStorage.setItem("userToken", res.data.token);

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

      socket.connect();
      notify(res.data.message, "success");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      notify(err.response.data.message, "error");
    }
  };

  return (
    <div className="flex lg:flex-row flex-col items-center px-5 justify-center h-full text-white">
      <div className="lg:mr-20 lg:mb-0 mb-10 lg:w-[450px]">
        <div className="flex items-center justify-center lg:justify-start">
          <img
            src="/assets/socialLogo.png"
            alt="logo"
            width="120"
            height="120"
            className="object-contain -ml-6"
          />

          <h1 className="text-5xl font-bold">Connect</h1>
        </div>

        <p className="text-lg lg:text-2xl font-semibold leading-[40px] text-center lg:text-left">
          Connect with friends and the world around you.
        </p>
      </div>

      <form
        onSubmit={handleClick}
        className="bg-bodySecondary p-5 w-full max-w-[450px] lg:w-[450px] h-[400px] flex flex-col rounded-md space-y-5"
      >
        <div className="space-y-5 flex-1">
          <div className="bg-[#28343e] w-full rounded-md px-3 py-3">
            <input
              required
              ref={email}
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent"
            />
          </div>
          <div className="bg-[#28343e] w-full rounded-md px-3 py-3 flex items-center space-x-3">
            <input
              required
              ref={password}
              minLength="6"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full outline-none bg-transparent"
            />
            {showPassword ? (
              <BsEyeFill
                className="cursor-pointer"
                color="darkgray"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <BsEyeSlashFill
                className="cursor-pointer"
                color="darkgray"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <p className="py-1 text-sm cursor-pointer">Forgot Password?</p>
        </div>

        <button
          disabled={isFetching}
          className="w-full bg-[#139e6b] py-2 rounded-md flex items-center justify-center"
        >
          {isFetching ? (
            <ReactLoading type="spin" color="white" height={20} width={20} />
          ) : (
            "Log In"
          )}
        </button>
        <Link to="/register">
          <button
            disabled={isFetching}
            className="w-full py-2 rounded-md flex items-center justify-center"
          >
            {isFetching ? (
              <ReactLoading type="spin" color="white" height={20} width={20} />
            ) : (
              "Create A New Account"
            )}
          </button>
        </Link>
      </form>
    </div>
  );
}

export default Login;
