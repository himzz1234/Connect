import React, { useEffect, useState } from "react";
import axios from "../axios";
import ReactLoading from "react-loading";

function ProfileWindow({ id }) {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      const res = await axios.get(`/users/${id}`);
      setProfile(res.data);

      if (res.status === 200) setIsLoading(false);
    };

    fetchProfileDetails();
  }, []);

  return (
    <div className="bg-bodySecondary transition-all duration-200 h-80 w-72 absolute z-20 -left-[320px] top-0 shadow-lg rounded-md px-2 py-2">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <ReactLoading type="spin" color="#3c37fe" height={30} width={30} />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="relative h-28 w-full">
            <img
              src={profile.coverPicture}
              className="w-full h-full rounded-sm object-cover"
            />
            <div className="absolute bottom-0 left-4 translate-y-1/2">
              <img
                src={profile.profilePicture}
                className="w-14 h-14 rounded-full border-[3px] border-white object-cover"
              />
            </div>
          </div>
          <div className="mt-10 bg-bodyPrimary flex-1 rounded-sm p-2">
            <h3 className="font-medium text-[17px]">{profile.username}</h3>
            <p className="text-[12px]">{`@${profile.email.split("@")[0]}`}</p>
            <div className="border-t-2 mt-2 py-2">
              <h6 className="text-[12px] uppercase font-medium text-[#b8b8b8]">
                Bio
              </h6>
              <p className="text-[13.5px]">{profile.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileWindow;
