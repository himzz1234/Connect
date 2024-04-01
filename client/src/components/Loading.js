import React from "react";
import ReactLoading from "react-loading";

function Loading() {
  return (
    <div className="w-full flex items-center justify-center h-screen fixed top-0 left-0 z-40 bg-primary">
      <div className="flex flex-col items-center justify-center">
        <img
          src="/assets/socialLogo.png"
          alt="logo"
          width="140"
          height="140"
          className="object-contain"
        />

        <ReactLoading type="spin" color="#1da1f2" height={28} width={28} />
      </div>
    </div>
  );
}

export default Loading;
