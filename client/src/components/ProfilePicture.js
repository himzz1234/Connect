import { AuthContext } from "../context/AuthContext";
import { MdAddAPhoto } from "react-icons/md";
import { useContext, useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";

function ProfilePicture() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileShown, setIsProfileShown] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const setMediaFile = async (image) => {
    setIsLoading(true);

    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "social-media");
    data.append("cloud_name", "dzcein87k");

    try {
      const file = await axios.post(
        "https://api.cloudinary.com/v1_1/dzcein87k/image/upload",
        data
      );
      await axios.put(`/users/${user._id}`, {
        userId: user._id,
        profilePicture: file.data.url.toString(),
      });

      setProfilePicture(file.data.url.toString());
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div
      onMouseEnter={() => setIsProfileShown(true)}
      onMouseLeave={() => setIsProfileShown(false)}
      className={`${
        isLoading ? "pointer-events-none" : "pointer-events-auto"
      } absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full border-4 border-bodySecondary cursor-pointer z-20`}
    >
      <div
        style={{ backgroundImage: `url(${profilePicture})` }}
        className={`${
          isProfileShown || isLoading ? "opacity-25" : "opacity-100"
        } w-full h-full bg-cover rounded-full`}
      ></div>

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <ReactLoading type="spin" color="white" height={20} width={20} />
        </div>
      )}

      {isProfileShown && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <label htmlFor="profile">
            <MdAddAPhoto color="#898f9d" className="text-xl cursor-pointer" />
          </label>
          <input
            type="file"
            id="profile"
            name="profile"
            accept="image/png, image/jpg, image/jpeg"
            className="hidden"
            onChange={(e) => setMediaFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;
