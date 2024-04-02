import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../helpers/validation";
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
    window.open(
      "https://mernsocialmedia.onrender.com/api/auth/google",
      "_self"
    );
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-background">
      <div className="h-full flex flex-1 flex-col lg:flex-row sm:p-2 gap-4 md:gap-8 lg:gap-0">
        <div className="bg-background lg:bg-[#f2f4f8] h-20 lg:h-full lg:w-[400px] xl:w-[580px] rounded-md">
          <img
            src="/assets/home-illustration-3.svg"
            className="h-full w-full hidden lg:block"
          />
        </div>

        <div className="flex flex-1 lg:items-center justify-center">
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer absolute left-1/2 -translate-x-1/2 lg:translate-x-0 top-2 lg:left-2"
          >
            <picture className="lg:-mr-4">
              <source
                media="(min-width: 992px)"
                srcSet="/assets/socialLogo.png"
                width={100}
                height={100}
              ></source>
              <source
                media="(min-width: 768px)"
                srcSet="/assets/socialLogo.png"
                width={120}
                height={120}
              ></source>
              <source
                media="(min-width: 600px)"
                srcSet="/assets/socialLogo.png"
                width={110}
                height={110}
              ></source>
              <img src="/assets/socialLogo.png" width={100} height={100} />
            </picture>
            <h1 className="font-bold text-[22px] hidden lg:block mt-3">
              connect
            </h1>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 w-96">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-center">
                Sign up to Connect
              </h1>
            </div>
            <div className="w-full px-5 sm:px-0 sm:max-w-[450px] sm:w-[450px] md:space-y-4 sm:space-y-3 space-y-2 self-center">
              <form
                onSubmit={handleSubmit}
                className="w-full md:h-fit flex flex-col rounded-md space-y-3 lg:space-y-5"
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
                  <p className="text-[14px] sm:text-[15px]">Sign Up</p>
                </button>
              </form>
              <p className="text-gray_dark text-sm relative text-center after:absolute after:w-1/3 after:h-0.5 after:top-1/2 after:left-10 w-full after:bg-gray-200 before:absolute before:w-1/3 before:h-0.5 before:bg-gray-200 before:top-1/2 before:right-10">
                or
              </p>
              <button
                onClick={signInGoogle}
                className="border-2 border-[#e8ebf3] w-full py-2.5 md:py-3 rounded-md text-[14px] flex items-center gap-2 justify-center"
              >
                <FcGoogle size={18} />
                <p className="text-[14px] sm:text-[15px]">
                  Sign up with google
                </p>
              </button>
              <p className="text-[14px] sm:text-[15px] text-gray_dark">
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
