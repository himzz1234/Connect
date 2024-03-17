import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import CoverPicture from "./CoverPicture";
import ProfilePicture from "./ProfilePicture";
import { FaPen, FaCheck } from "react-icons/fa";

function Profile() {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const [descText, setDescText] = useState(user?.desc);
  const [count, setCount] = useState(user.desc?.length);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await axios.get(`/users/friends/${user._id}`);
        setFriends(friendsList.data);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, []);

  const changeDescription = async () => {
    if (count <= 50) {
      try {
        await axios.put(`/users/${user._id}`, {
          userId: user._id,
          desc: descText,
        });

        setCanEdit(false);
      } catch (err) {
        console.log(err);
      }
    } else console.log("The limit has exceeded!");
  };

  return (
    <div className="order-1 lg:order-1 w-full lg:w-3/12 bg-bodyPrimary rounded-md px-5 py-6 h-full">
      <div className="">
        <div className="relative">
          <CoverPicture />
          <ProfilePicture />
        </div>

        <div className="mt-9 flex items-center flex-col">
          <h2 className="font-normal font-lato text-[15px] md:text-[17px]">
            {user?.username}
          </h2>
          <p className="text-[12px]">{`@${user.email.split("@")[0]}`}</p>
        </div>

        <div className="flex flex-col mt-5">
          <div className="flex items-center justify-between py-2 border-b-2 border-t-2">
            <p className="text-[13px] uppercase font-semibold text-[#b8b8b8]">
              Bio
            </p>
            {canEdit ? (
              <FaCheck
                onClick={changeDescription}
                className="text-xs cursor-pointer"
                color="#20da97"
              />
            ) : (
              <FaPen
                onClick={() => setCanEdit(true)}
                className="text-xs cursor-pointer"
                color="#1da1f2"
              />
            )}
          </div>
          <textarea
            rows="3"
            className="w-full outline-none mt-4 bg-transparent resize-none text-[12px] md:text-[13.5px]"
            value={descText}
            onChange={(e) => setDescText(e.target.value)}
            onInput={(e) => setCount(e.target.value.length)}
            readOnly={!canEdit}
          />

          <small
            className={`text-right ${
              count > 50 ? "text-red-400" : "text-[#b8b8b8]"
            }`}
          >
            {count ? count : 0}/50
          </small>
        </div>

        <div className="hidden lg:flex flex-col mt-5">
          <div className="flex items-center justify-between py-2 border-b-2 border-t-2">
            <p className="flex-1 text-[13px] font-semibold uppercase text-[#b8b8b8]">
              Connections
            </p>
          </div>
          <div className="space-x-3 mt-6 flex items-center">
            {friends.map((friend) => (
              <div
                key={friend._id}
                style={{ backgroundImage: `url(${friend?.profilePicture})` }}
                className="w-9 h-9 rounded-full bg-cover"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
