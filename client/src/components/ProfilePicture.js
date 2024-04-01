import { AuthContext } from "../context/AuthContext";
import { MdAddAPhoto } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import axios from "../axios";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";

function ProfilePicture() {
  const { user } = useContext(AuthContext);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const { uploadToCloudinary, loading } = useCloudinaryUpload();
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture);

  const updateProfilePicture = async (image) => {
    setIsProfileShown(false);

    try {
      const url = await uploadToCloudinary(image);
      await axios.put(
        `/users/${user._id}`,
        {
          userId: user._id,
          profilePicture: url,
        },
        { withCredentials: true }
      );

      setProfilePicture(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`absolute cursor-pointer bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full border-2 z-20 bg-background ${
        loading && "pointer-events-none"
      }`}
    >
      <div
        onMouseEnter={() => {
          !loading && setIsProfileShown(true);
        }}
        onMouseLeave={() => {
          !loading && setIsProfileShown(false);
        }}
        className="w-full h-full"
      >
        <div
          style={{
            backgroundImage: `url(${profilePicture})`,
          }}
          className={`${
            isProfileShown || loading ? "opacity-25" : "opacity-100"
          } w-full h-full bg-cover rounded-full`}
        ></div>

        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <ReactLoading type="spin" color="#1da1f2" height={20} width={20} />
          </div>
        )}

        {isProfileShown && !loading && (
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <label htmlFor="profile">
              <MdAddAPhoto color="#898f9d" className="text-xl cursor-pointer" />
            </label>
            <input
              type="file"
              id="profile"
              accept="image/png, image/jpg, image/jpeg"
              className="hidden"
              onChange={(e) => updateProfilePicture(e.target.files[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePicture;
