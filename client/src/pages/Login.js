import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "../axios";
import { FcGoogle } from "react-icons/fc";
import InputContainer from "../components/InputContainer";
import toast from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const navigate = useNavigate();
  const { isFetching, dispatch } = useContext(AuthContext);
  const handleClick = async (e) => {
    e.preventDefault();

    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
          rememberMe,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
      toast.error(err.message);
    }
  };

  const signInGoogle = async () => {
    window.open(
      "https://mernsocialmedia.onrender.com/api/auth/google",
      "_self"
    );
  };

  const recoverPassword = async (e) => {
    e.preventDefault();
    setForgotPassword(true);

    try {
      if (formData.email) {
        const res = await axios.post("/auth/sendresetmail", {
          emailId: formData.email,
        });

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
          {forgotPassword ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-3xl text-center font-semibold">
                  Forgot Password?
                </h1>
                {/* <p className="leading-[26px] text-[15px]">
                  No problem. Just enter your email address and we will tell you
                  what to do next.
                </p> */}
              </div>

              <div className="w-full max-w-[450px] lg:w-[450px] space-y-4 self-center">
                <form
                  onSubmit={recoverPassword}
                  className="w-full md:h-fit flex flex-col rounded-md space-y-2 lg:space-y-5"
                >
                  <div className="space-y-5 flex-1">
                    <InputContainer
                      name="email"
                      type="email"
                      {...{ formData, setFormData }}
                    ></InputContainer>
                  </div>

                  <button className="primary-btn">Recover Password</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-3xl font-semibold text-center">
                  Sign in to Connect
                </h1>
              </div>
              <div className="w-full max-w-[450px] lg:w-[450px] space-y-4 self-center">
                <form
                  onSubmit={handleClick}
                  className="w-full md:h-fit flex flex-col rounded-md space-y-2 lg:space-y-5"
                >
                  <div className="space-y-5 flex-1">
                    <InputContainer
                      name="email"
                      type="email"
                      {...{ formData, setFormData }}
                    ></InputContainer>
                    <InputContainer
                      name="password"
                      type={showPassword ? "text" : "password"}
                      {...{ formData, setFormData }}
                    >
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <p className="text-[13px] md:text-sm">Remember me</p>
                      </div>
                      <p
                        onClick={recoverPassword}
                        className="text-[13px] text-accent hover:underline md:text-sm cursor-pointer"
                      >
                        Forgot Password?
                      </p>
                    </div>
                  </div>

                  <button disabled={isFetching} className="primary-btn">
                    {isFetching ? (
                      <ReactLoading
                        type="spin"
                        color="white"
                        height={20}
                        width={20}
                      />
                    ) : (
                      <p className="text-[15px]">Log In</p>
                    )}
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
                  <p className="text-[15px]">Sign in with google</p>
                </button>
                <p className="text-[15px] text-gray_dark">
                  Don't have an account?{" "}
                  <Link to="/register">
                    <span className="w-full py-2 rounded-md text-accent font-medium hover:underline">
                      Register
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
