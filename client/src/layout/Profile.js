import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import CoverPicture from "../components/CoverPicture";
import ProfilePicture from "../components/ProfilePicture";
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
        const res = await axios.get(`/users/friends/${user._id}`, {
          withCredentials: true,
        });

        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getFriends();
  }, []);

  const changeDescription = async () => {
    if (count <= 50) {
      try {
        await axios.put(
          `/users/${user._id}`,
          {
            userId: user._id,
            desc: descText,
          },
          { withCredentials: true }
        );

        setCanEdit(false);
      } catch (err) {
        console.log(err);
      }
    } else console.log("The limit has exceeded!");
  };

  return (
    <>
      <div className="relative">
        <CoverPicture />
        <ProfilePicture />
      </div>

      <div className="mt-9 flex items-center flex-col">
        <h2 className="text-[15px] md:text-[16px] font-medium">
          {user?.username}
        </h2>
        <p className="text-[12px] text-gray_dark">{`@${
          user.email.split("@")[0]
        }`}</p>
      </div>

      <div className="flex flex-col mt-5">
        <div className="flex items-center justify-between py-2 border-b-2 border-t-2">
          <p className="text-[13px] uppercase font-medium text-gray_dark">
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
          className="w-full outline-none mt-3 bg-transparent resize-none text-[12px] sm:text-[14.5px]"
          value={descText}
          onChange={(e) => setDescText(e.target.value)}
          onInput={(e) => setCount(e.target.value.length)}
          readOnly={!canEdit}
        />

        <small
          className={`text-right ${
            count > 50 ? "text-red-400" : "text-gray_dark"
          }`}
        >
          {count ? count : 0}/50
        </small>
      </div>

      <div className="hidden lg:flex flex-col mt-5">
        <div className="flex items-center justify-between py-2 border-b-2 border-t-2">
          <p className="flex-1 text-[13px] font-medium uppercase text-gray_dark">
            Connections
          </p>
        </div>
        <div className="gap-2 mt-3 flex items-center flex-wrap">
          {friends.slice(0, 16).map((friend) => (
            <div
              key={friend._id}
              className="w-9 h-9 rounded-full bg-cover"
              style={{ backgroundImage: `url(${friend?.profilePicture})` }}
            ></div>
          ))}
          {friends.length > 16 && (
            <div className="bg-secondary rounded-full w-9 h-9 flex items-center border-2 justify-center">
              <p className="text-sm font-medium">+{friends.length - 20}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
