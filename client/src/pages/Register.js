import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Passwords dont match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        const res = await axios.post("/auth/register", user);
        notify(res.data.message, "success");

        navigate("/login");
      } catch (err) {
        notify(err.response.data.message, "error");
      }
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
        <div className="lg:mr-20 lg:mb-0 mb-2">
          <div className="lg:flex items-center justify-center lg:justify-start hidden">
            <img
              src="/assets/Illustration.png"
              alt="logo"
              width="500"
              height="500"
              className="object-contain"
            />
          </div>

          {/* <p className="hidden lg:block text-lg lg:text-2xl font-semibold leading-[40px] text-center lg:text-left">
          Connect with friends and the world around you.
        </p> */}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-bodySecondary p-5 w-full max-w-[450px] lg:w-[450px] h-[400px] md:h-[450px] flex flex-col rounded-md space-y-2 lg:space-y-5"
        >
          <div className="space-y-5 flex-1">
            <div className="bg-inputFields w-full rounded-md px-3 py-3">
              <input
                required
                ref={username}
                type="text"
                placeholder="Username"
                className="w-full outline-none bg-transparent text-[14px] md:text-base placeholder-[#A9A9A9]"
              />
            </div>
            <div className="bg-inputFields w-full rounded-md px-3 py-3">
              <input
                required
                ref={email}
                type="email"
                placeholder="Email"
                className="w-full outline-none bg-transparent text-[14px] md:text-base placeholder-[#A9A9A9]"
              />
            </div>
            <div className="bg-inputFields w-full rounded-md px-3 py-3 flex items-center space-x-3">
              <input
                minLength="6"
                required
                ref={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full outline-none bg-transparent text-[14px] md:text-base placeholder-[#A9A9A9]"
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
            <div className="bg-inputFields w-full rounded-md px-3 py-3 flex items-center space-x-3">
              <input
                minLength="6"
                required
                ref={passwordAgain}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full outline-none bg-transparent text-[14px] md:text-base placeholder-[#A9A9A9]"
              />
              {showConfirmPassword ? (
                <BsEyeFill
                  className="cursor-pointer"
                  color="darkgray"
                  onClick={() => setShowConfirmPassword(false)}
                />
              ) : (
                <BsEyeSlashFill
                  className="cursor-pointer"
                  color="darkgray"
                  onClick={() => setShowConfirmPassword(true)}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#139e6b] py-2 rounded-md text-[14px] md:text-base"
          >
            Sign Up
          </button>
          <Link to="/login">
            <button className="w-full py-2 rounded-md text-[14px] md:text-base">
              Login Into Account
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
