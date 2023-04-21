import { useContext, useState } from "react";
import { MdAddAPhoto } from "react-icons/md";
import ReactLoading from "react-loading";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function CoverPicture() {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCoverShown, setIsCoverShown] = useState(false);
  const [coverPicture, setCoverPicture] = useState(user.coverPicture);

  const setMediaFile = async (image) => {
    setIsLoading(true);
    setIsCoverShown(false);

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
        coverPicture: file.data.url.toString(),
      });

      setCoverPicture(file.data.url.toString());
    } catch (err) {
      console.log(err);
    }

    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div
      className={`relative z-10`}
      onMouseEnter={() => {
        !isLoading && setIsCoverShown(true);
      }}
      onMouseLeave={() => {
        !isLoading && setIsCoverShown(false);
      }}
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
          <ReactLoading type="spin" color="white" height={20} width={20} />
        </div>
      )}

      {isCoverShown && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-20">
          <label htmlFor="cover">
            <MdAddAPhoto color="#898f9d" className="text-5xl cursor-pointer" />
          </label>
          <input
            type="file"
            id="cover"
            name="cover"
            accept="image/png, image/jpg, image/jpeg"
            className="hidden"
            onChange={(e) => setMediaFile(e.target.files[0])}
          />
        </div>
      )}
      <img
        src={coverPicture}
        className={`rounded-md h-[180px] w-full object-cover ${
          isCoverShown || isLoading
            ? "opacity-25 cursor-pointer"
            : "opacity-100"
        }`}
      />
    </div>
  );
}

export default CoverPicture;
