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
    <div className="flex lg:flex-row flex-col items-center justify-center h-full text-white">
      <div className="lg:mr-20 lg:mb-0 mb-10 lg:w-[450px] ">
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

        <p className="text-lg lg:text-2xl font-semibold leading-[40px]">
          Connect with friends and the world around you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-bodySecondary p-5 w-[450px] h-[450px] flex flex-col rounded-md space-y-5"
      >
        <div className="space-y-5 flex-1">
          <div className="bg-[#28343e] w-full rounded-md px-3 py-3">
            <input
              required
              ref={username}
              type="text"
              placeholder="Username"
              className="w-full outline-none bg-transparent"
            />
          </div>
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
              minLength="6"
              required
              ref={password}
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
          <div className="bg-[#28343e] w-full rounded-md px-3 py-3 flex items-center space-x-3">
            <input
              minLength="6"
              required
              ref={passwordAgain}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full outline-none bg-transparent"
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

        <button type="submit" className="w-full bg-[#139e6b] py-2 rounded-md">
          Sign Up
        </button>
        <Link to="/login">
          <button className="w-full py-2 rounded-md">Login Into Account</button>
        </Link>
      </form>
    </div>
  );
}

export default Register;
