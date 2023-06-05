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
    <div className="h-full flex flex-col">
      <div className="px-5 flex items-center justify-center lg:justify-start">
        <img
          src="/assets/socialLogo.png"
          alt="logo"
          className="object-contain lg:w-[100px] lg:h-[100px] w-[140px] h-[140px]"
        />
        <h1 className="hidden lg:flex text-2xl font-bold text-white">
          Connect
        </h1>
      </div>
      <div className="flex flex-1 lg:flex-row lg:mt-20 flex-col px-5 items-center lg:items-start lg:justify-center text-white">
        <div className="lg:mr-20 lg:mb-0 mb-2 ">
          <div className="lg:flex items-center justify-center lg:justify-start hidden">
            <img
              src="/assets/Illustration.png"
              alt="logo"
              width="500"
              height="500"
              className="object-contain"
            />
          </div>
          {/* 
        <p className="hidden lg:block lg:text-2xl font-semibold leading-[40px] text-center lg:text-left">
          Connect with friends and the world around you.
        </p> */}
        </div>

        <form
          onSubmit={handleClick}
          className="bg-bodySecondary p-5 w-full max-w-[450px] lg:w-[450px] h-[350px] md:h-[400px] flex flex-col rounded-md space-y-2 lg:space-y-5"
        >
          <div className="space-y-5 flex-1">
            <div className="bg-[#28343e] w-full rounded-md px-3 py-3">
              <input
                required
                ref={email}
                type="email"
                placeholder="Email"
                className="w-full outline-none bg-transparent text-[14px] md:text-base"
              />
            </div>
            <div className="bg-[#28343e] w-full rounded-md px-3 py-3 flex items-center space-x-3">
              <input
                required
                ref={password}
                minLength="6"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full outline-none bg-transparent text-[14px] md:text-base"
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

            <p className="py-1 text-[13px] md:text-sm cursor-pointer">
              Forgot Password?
            </p>
          </div>

          <button
            disabled={isFetching}
            className="w-full bg-[#139e6b] text-[14px] md:text-base py-2 rounded-md flex items-center justify-center"
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
              className="w-full py-2 text-[14px] md:text-base rounded-md flex items-center justify-center"
            >
              {isFetching ? (
                <ReactLoading
                  type="spin"
                  color="white"
                  height={20}
                  width={20}
                />
              ) : (
                "Create A New Account"
              )}
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
