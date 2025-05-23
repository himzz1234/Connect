import React, { useState } from "react";
import axios from "../axios";
import ReactLoading from "react-loading";

function SearchbarResults({ u, user }) {
  const [status, setStatus] = useState(
    user?.following.findIndex((f) => f === u._id) > -1 ? "Unfollow" : "Follow"
  );

  const [loading, setLoading] = useState(false);
  const followUser = async (id) => {
    setLoading(true);
    try {
      await axios.post(
        `/conversation`,
        {
          senderId: user?._id,
          receiverId: id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }

    await axios.put(
      `/users/follow/${id}`,
      {
        userId: user?._id,
      },
      { withCredentials: true }
    );

    setLoading(false);
    setStatus("Unfollow");
  };

  const unfollowUser = async (id) => {
    setLoading(true);

    await axios.put(
      `/users/unfollow/${id}`,
      {
        userId: user?._id,
      },
      { withCredentials: true }
    );

    setLoading(false);
    setStatus("Follow");
  };

  return (
    <div className="flex flex-col md:flex-row md:space-x-3 md:items-center">
      <div className="flex flex-1 items-center space-x-3 py-3 pl-3">
        <div
          style={{ backgroundImage: `url(${u?.profilePicture})` }}
          className="w-7 h-7 md:w-9 md:h-9 bg-cover rounded-full"
        ></div>
        <div className="flex-1">
          <small className="text-[12px] text-[#73899a]">
            @{u.email?.split("@")[0]}
          </small>
          <p className="flex items-center space-x-[0.5px] text-[13px] sm:text-[14px] font-medium">
            {u.username}
          </p>
        </div>
      </div>
      {loading ? (
        <div className="flex mb-2 md:mb-0 md:items-center md:justify-center px-3 md:px-5">
          <ReactLoading type="spin" color="#1da1f2" height={18} width={18} />
        </div>
      ) : (
        <div className="mb-2 md:mb-0">
          {status == "Unfollow" ? (
            <button
              onClick={() => unfollowUser(u._id)}
              className="text-red-500 text-xs px-3 py-1 font-medium rounded-sm"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={() => followUser(u._id)}
              className="text-accent text-xs px-3 py-1 font-medium rounded-sm"
            >
              Follow
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchbarResults;
