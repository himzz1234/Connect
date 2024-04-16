import React, { useState } from "react";
import ReactLoading from "react-loading";

export default function ButtonLoader({ text, callbackFn }) {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);

    await callbackFn();
    setLoading(false);
  };

  return (
    <button
      disabled={loading}
      onClick={handleButtonClick}
      className={`primary-btn ${loading && "pointer-events-none"}`}
    >
      {loading ? (
        <ReactLoading type="spin" color="white" height={20} width={20} />
      ) : (
        <p className="text-[14px] sm:text-[15px]">{text}</p>
      )}
    </button>
  );
}
