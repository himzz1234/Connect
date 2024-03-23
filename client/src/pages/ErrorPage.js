import React from "react";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-full flex justify-center bg-background">
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
      <div className="w-[500px] flex flex-col items-center">
        <img src="/assets/404illustration.svg" width={500} height={500} />
        <div className="w-[400px]">
          <p className="font-medium text-[20px] text-center">
            Oops. The page doesn't exist!
          </p>
          <button onClick={() => navigate("/")} className="primary-btn mt-4">
            <p className="text-[15px]">Back to home</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
