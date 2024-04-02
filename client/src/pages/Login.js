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
    <div className="min-h-screen flex flex-col bg-background">
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
            <h1 className="font-bold lg:text-[22px] hidden lg:block lg:mt-3">
              connect
            </h1>
          </div>
          {forgotPassword ? (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-center">
                  Forgot Password?
                </h1>
              </div>

              <div className="w-full px-5 sm:px-0 sm:max-w-[450px] sm:w-[450px] self-center">
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

                  <button className="primary-btn">
                    <p className="text-[14px] sm:text-[15px]">
                      Recover Password
                    </p>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="flex flex-col gap-2 w-96">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-center">
                  Sign in to Connect
                </h1>
              </div>
              <div className="w-full px-5 sm:px-0 sm:max-w-[450px] sm:w-[450px] md:space-y-4 sm:space-y-3 space-y-2 self-center">
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
                        <p className="text-[13px] sm:text-sm md:text-[15px]">
                          Remember me
                        </p>
                      </div>
                      <p
                        onClick={recoverPassword}
                        className="text-[13px] sm:text-sm md:text-[15px] text-accent hover:underline md:text-sm cursor-pointer"
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
                      <p className="text-[13px] sm:text-[15px]">Log In</p>
                    )}
                  </button>
                </form>
                <p className="text-gray_dark text-sm relative text-center after:absolute after:w-1/3 after:h-0.5 after:top-1/2 after:left-10 w-full after:bg-gray-200 before:absolute before:w-1/3 before:h-0.5 before:bg-gray-200 before:top-1/2 before:right-10">
                  or
                </p>
                <button
                  onClick={signInGoogle}
                  className="border-2 border-[#e8ebf3] w-full py-2 sm:py-3 rounded-md flex items-center gap-2 justify-center"
                >
                  <FcGoogle size={18} />
                  <p className="text-[13px] sm:text-[15px]">
                    Sign in with google
                  </p>
                </button>
                <p className="text-[13px] sm:text-[15px] text-gray_dark">
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
