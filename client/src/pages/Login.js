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
    window.open("http://localhost:8800/api/auth/google", "_self");
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
          {forgotPassword ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-4xl font-semibold">Forgot Password?</h1>
                <p className="leading-[26px] text-[15px]">
                  No problem. Just enter your email address and we will tell you
                  what to do next.
                </p>
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
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-4xl font-semibold">Welcome Back</h1>
                <p className="leading-[26px] text-[15px]">
                  Ready to Reconnect? Log In Here.
                </p>
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
                        className="text-[13px] text-[#1da1f2] hover:underline md:text-sm cursor-pointer"
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
