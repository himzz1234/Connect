import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation";
import {
  IoIosCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import InputContainer from "../components/InputContainer";
import toast from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateName(formData.username) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password)
    ) {
    } else {
      const user = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      try {
        const res = await axios.post("/auth/register", user, {
          withCredentials: true,
        });

        toast.success(res.data.message);
        navigate("/login");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const signInGoogle = async () => {
    window.open("http://localhost:8800/api/auth/google", "_self");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-full flex flex-1 flex-col md:flex-row text-black p-2 gap-8 md:gap-10 lg:gap-20">
        <div className="bg-white md:bg-[#f2f4f8] h-20 md:h-full md:w-[400px] lg:w-[500px] rounded-md">
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
          >
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
              <h1 className="text-4xl font-semibold">Create an account</h1>
              <p className="leading-[26px] text-[15px]">
                Connect and Share: Join Our Community Today!
              </p>
            </div>
            <div className="w-full max-w-[450px] lg:w-[450px] space-y-4 self-center">
              <form
                onSubmit={handleSubmit}
                className="w-full md:h-fit flex flex-col rounded-md space-y-2 lg:space-y-5"
              >
                <div className="space-y-3 flex-1">
                  <InputContainer
                    name="username"
                    type="text"
                    {...{ formData, setFormData }}
                  >
                    {!validateName(formData.username) ? (
                      <IoMdCloseCircleOutline size={20} color="red" />
                    ) : (
                      <IoIosCheckmarkCircleOutline size={20} color="green" />
                    )}
                  </InputContainer>
                  <InputContainer
                    name="email"
                    type="email"
                    {...{ formData, setFormData }}
                  >
                    {!validateEmail(formData.email) ? (
                      <IoMdCloseCircleOutline size={20} color="red" />
                    ) : (
                      <IoIosCheckmarkCircleOutline size={20} color="green" />
                    )}
                  </InputContainer>
                  <InputContainer
                    name="password"
                    type={showPassword ? "text" : "password"}
                    {...{ formData, setFormData }}
                  >
                    {!validatePassword(formData.password) ? (
                      <IoMdCloseCircleOutline size={20} color="red" />
                    ) : (
                      <IoIosCheckmarkCircleOutline size={20} color="green" />
                    )}
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
                  </InputContainer>
                </div>

                <button type="submit" className="primary-btn">
                  Sign Up
                </button>
              </form>
              <button
                onClick={signInGoogle}
                className="border-2 border-[#e8ebf3] w-full py-3 rounded-md text-[14px] flex items-center gap-2 justify-center"
              >
                <FcGoogle size={18} />
                <p>Sign up with google</p>
              </button>
              <p className="text-[14px]">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="w-full py-2 rounded-md text-[#1da1f2] font-medium">
                    Login
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

export default Register;
