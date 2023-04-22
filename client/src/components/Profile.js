import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import CoverPicture from "./CoverPicture";
import ProfilePicture from "./ProfilePicture";
import { FaPen, FaCheck } from "react-icons/fa";

function Lsidebar() {
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
    <div className="order-1 lg:order-1 w-full lg:w-3/12 bg-bodySecondary rounded-md px-5 py-6 lg:h-[85vh]">
      <div className="">
        <div className="relative">
          <CoverPicture />
          <ProfilePicture />
        </div>

        <div className="mt-9 flex items-center flex-col space-y-1">
          <h2 className="font-semibold">{user?.username}</h2>
          <p className="text-[12.5px] text-[#73899a]">{user?.city}</p>
        </div>

        <div className="flex flex-col mt-5">
          <div className="flex items-center justify-between border-t-2 border-b-2 border-[#28343e] py-2">
            <p className="text-[13px] text-[#6b7985]">Intro</p>
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
            className="w-full outline-none mt-4 bg-transparent resize-none text-[13px]"
            value={descText}
            onChange={(e) => setDescText(e.target.value)}
            onInput={(e) => setCount(e.target.value.length)}
            readOnly={!canEdit}
          />

          <small
            className={`text-right ${
              count > 50 ? "text-red-400" : "text-white"
            }`}
          >
            {count ? count : 0}/50
          </small>
        </div>

        <div className="hidden lg:flex flex-col mt-5">
          <div className="flex items-center border-t-2 border-b-2 border-[#28343e] py-2">
            <p className="flex-1 text-[13px] text-[#6b7985]">Friends</p>
          </div>
          <div className="space-x-3 mt-6 flex items-center justify-center">
            {friends.map((friend) => (
              <div
                key={friend._id}
                style={{ backgroundImage: `url(${friend?.profilePicture})` }}
                className="w-8 h-8 rounded-full bg-cover"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lsidebar;
