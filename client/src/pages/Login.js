import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axios";
import { FcGoogle } from "react-icons/fc";

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
  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "/auth/login",
        {
          email: email.current.value,
          password: password.current.value,
        },
        { withCredentials: true }
      );

      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
      notify(res.data.message, "success");
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      notify(err.response.data.message, "error");
    }
  };

  const signInGoogle = async () => {
    window.open(
      "https://mernsocialmedia.onrender.com/api/auth/google",
      "_self"
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-full flex flex-1 flex-col md:flex-row text-black p-2 gap-8 md:gap-10 lg:gap-20">
        <div className="bg-white md:bg-[#f2f4f8] h-20 md:h-full md:w-[400px] lg:w-[500px] rounded-md">
          <div className="flex items-center md:ml-0">
            <img
              src="/assets/socialLogo.png"
              width={100}
              height={100}
              className="-mr-4"
            />
            <h1 className="font-bold text-[30px] font-oswald">connect</h1>
          </div>
          <img
            src="/assets/home-illustration-3.svg"
            className="h-full w-full hidden md:block"
          />
        </div>

        <div className="flex flex-1 md:items-center justify-center md:justify-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 w-96">
              <h1 className="text-4xl font-semibold">Welcome Back</h1>
              <p className="leading-[26px] text-[15px]">
                and connect with millions of people online.
              </p>
            </div>

            <div className="w-full max-w-[450px] lg:w-[450px] space-y-4 self-center">
              <form
                onSubmit={handleClick}
                className="w-full md:h-fit flex flex-col rounded-md space-y-2 lg:space-y-5"
              >
                <div className="space-y-5 flex-1">
                  <div className="gap-2 flex flex-col">
                    <label className="text-[#85929f] font-medium text-sm">
                      Email
                    </label>
                    <div className="border-2 border-[#e8ebf3] w-full rounded-md px-3 py-1.5">
                      <input
                        required
                        ref={email}
                        type="email"
                        placeholder="Email"
                        className="w-full outline-none bg-transparent text-[14px] font-medium placeholder-[#A9A9A9]"
                      />
                    </div>
                  </div>
                  <div className="gap-2 flex flex-col">
                    <label className="text-[#85929f] font-medium text-sm">
                      Password
                    </label>
                    <div className="border-2 border-[#e8ebf3] w-full rounded-md px-3 py-1.5 flex items-center space-x-3">
                      <input
                        minLength="6"
                        required
                        ref={password}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full outline-none bg-transparent text-[14px] font-medium placeholder-[#A9A9A9]"
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
                  </div>

                  {/* <p className="py-1 text-[13px] md:text-sm cursor-pointer">
                    Forgot Password?
                  </p> */}
                </div>

                <button
                  disabled={isFetching}
                  className="w-full bg-[#1da1f2] py-3 rounded-md text-[14px] text-white"
                >
                  {isFetching ? (
                    <ReactLoading
                      type="spin"
                      color="white"
                      height={20}
                      width={20}
                    />
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>
              <button
                onClick={signInGoogle}
                className="border-2 border-[#e8ebf3] w-full py-3 rounded-md text-[14px] flex items-center gap-2 justify-center"
              >
                <FcGoogle size={18} />
                <p>Sign in with google</p>
              </button>
              <p className="text-[14px]">
                Don't have an account?{" "}
                <Link to="/register">
                  <span className="w-full py-2 rounded-md text-[#1da1f2] font-medium">
                    Register
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
