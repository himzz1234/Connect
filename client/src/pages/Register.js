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
    <div className="h-full flex flex-col bg-background">
      <div className="h-full flex flex-1 flex-col md:flex-row text-black p-2 gap-8 md:gap-0">
        <div className="bg-background md:bg-[#f2f4f8] h-20 md:h-full md:w-[400px] lg:w-[580px] rounded-md">
          <img
            src="/assets/home-illustration-3.svg"
            className="h-full w-full hidden md:block"
          />
        </div>

        <div className="flex flex-1 md:items-center justify-center">
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer absolute top-2 left-2"
          >
            <img
              src="/assets/socialLogo.png"
              width={80}
              height={80}
              className="-mr-3.5"
            />
            <h1 className="font-bold text-[22px] font-oswald mt-2">connect</h1>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 w-96">
              <h1 className="text-3xl font-semibold text-center">
                Sign up to Connect
              </h1>
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
                    {!validateName(formData.username) && formData.username && (
                      <IoMdCloseCircleOutline size={20} color="red" />
                    )}

                    {validateName(formData.username) && (
                      <IoIosCheckmarkCircleOutline size={20} color="green" />
                    )}
                  </InputContainer>
                  <InputContainer
                    name="email"
                    type="email"
                    {...{ formData, setFormData }}
                  >
                    {!validateEmail(formData.email) && formData.email && (
                      <IoMdCloseCircleOutline size={20} color="red" />
                    )}

                    {validateEmail(formData.email) && (
                      <IoIosCheckmarkCircleOutline size={20} color="green" />
                    )}
                  </InputContainer>
                  <InputContainer
                    name="password"
                    type={showPassword ? "text" : "password"}
                    {...{ formData, setFormData }}
                  >
                    {!validatePassword(formData.password) &&
                      formData.password && (
                        <IoMdCloseCircleOutline size={20} color="red" />
                      )}

                    {validatePassword(formData.password) && (
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
                  <p className="text-[15px]">Sign Up</p>
                </button>
              </form>
              <p className="text-gray_dark text-sm relative text-center after:absolute after:w-1/3 after:h-0.5 after:top-1/2 after:left-10 w-full after:bg-gray-200 before:absolute before:w-1/3 before:h-0.5 before:bg-gray-200 before:top-1/2 before:right-10">
                or
              </p>
              <button
                onClick={signInGoogle}
                className="border-2 border-[#e8ebf3] w-full py-3 rounded-md text-[14px] flex items-center gap-2 justify-center"
              >
                <FcGoogle size={18} />
                <p className="text-[15px]">Sign up with google</p>
              </button>
              <p className="text-[15px] text-gray_dark">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="w-full py-2 rounded-md hover:underline text-accent font-medium">
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
