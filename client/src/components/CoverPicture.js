import { useContext, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import ReactLoading from "react-loading";
import { AuthContext } from "../context/AuthContext";
import axios from "../axios";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";

function CoverPicture() {
  const { user } = useContext(AuthContext);
  const [isCoverShown, setIsCoverShown] = useState(false);
  const { uploadToCloudinary, loading } = useCloudinaryUpload();
  const [coverPicture, setCoverPicture] = useState(user?.coverPicture);

  const updateCoverPicture = async (image) => {
    setIsCoverShown(false);

    try {
      const url = await uploadToCloudinary(image);
      await axios.put(
        `/users/${user._id}`,
        {
          userId: user._id,
          coverPicture: url,
        },
        { withCredentials: true }
      );

      setCoverPicture(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`relative z-10 ${loading && "pointer-events-none"}`}
      onMouseEnter={() => {
        !loading && setIsCoverShown(true);
      }}
      onMouseLeave={() => {
        !loading && setIsCoverShown(false);
      }}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
          <ReactLoading type="spin" color="#1da1f2" height={20} width={20} />
        </div>
      )}

      {isCoverShown && !loading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
          <label htmlFor="cover">
            <MdAddAPhoto color="#898f9d" className="text-5xl cursor-pointer" />
          </label>
          <input
            type="file"
            id="cover"
            className="hidden"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => updateCoverPicture(e.target.files[0])}
          />
        </div>
      )}
      <img
        src={coverPicture}
        className={`rounded-md h-[180px] w-full object-cover ${
          isCoverShown || loading ? "opacity-25 cursor-pointer" : "opacity-100"
        }`}
      />
    </div>
  );
}

export default CoverPicture;
