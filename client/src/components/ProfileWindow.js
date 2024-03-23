import React, { useEffect, useState } from "react";
import axios from "../axios";
import ReactLoading from "react-loading";
import { AnimatePresence, motion } from "framer-motion";

function ProfileWindow({ id }) {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const res = await axios.get(`/users/${id}`);
        setProfile(res.data);

        if (res.status === 200) setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, type: "tween" }}
      className="bg-secondary h-80 w-72 absolute -left-[320px] top-0 shadow-lg rounded-md px-2 py-2"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <ReactLoading type="spin" color="#1da1f2" height={30} width={30} />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="relative h-28 w-full">
            <img
              src={profile?.coverPicture}
              className="w-full h-full rounded-sm object-cover"
            />
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <img
                src={profile?.profilePicture}
                className="w-14 h-14 rounded-full border-[3px] border-white object-cover"
              />
            </div>
          </div>
          <div className="mt-10 bg-primary flex-1 rounded-sm p-2">
            <h3 className="font-medium text-[17px]">{profile.username}</h3>
            <p className="text-[12px]">{`@${profile.email.split("@")[0]}`}</p>
            <div className="border-t-2 mt-2 py-2">
              <h6 className="text-[12px] uppercase font-medium text-gray_dark">
                Bio
              </h6>
              <p className="text-[13.5px]">{profile.desc}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default ProfileWindow;
