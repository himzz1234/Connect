import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import { validatePassword } from "../utils/validation";
import {
  IoIosCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import InputContainer from "../components/InputContainer";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
  });

  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const setNewPassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      return;
    }

    try {
      const res = await axios.put(
        "/auth/resetpassword",
        {
          password: formData.password,
        },
        { headers: { access_token: token } }
      );

      toast.success(res.data.message);
      if (res.status == 200) {
        navigate("/");
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
            <h1 className="font-bold text-[22px] mt-2">connect</h1>
          </div>
          <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 w-96">
              <h1 className="text-3xl font-semibold text-center">
                Reset Password
              </h1>
            </div>
            <div className="w-full max-w-[450px] lg:w-[450px] space-y-4 self-center">
              <form
                onSubmit={setNewPassword}
                className="w-full md:h-fit flex flex-col rounded-md space-y-2 lg:space-y-5"
              >
                <div className="space-y-5 flex-1">
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
                  Reset Password
                </button>
              </form>
              <p className="text-[15px] text-gray_dark">
                Remember your password?{" "}
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

export default ResetPassword;
