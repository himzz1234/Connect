import React, { useState, useContext, useRef } from "react";
import axios from "../axios";
import { RiAttachment2 } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import ReactLoading from "react-loading";
import Posts from "../components/Posts";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";

function Feed() {
  const desc = useRef();
  const imageRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageToSend, setImageToSend] = useState("");
  const { uploadToCloudinary } = useCloudinaryUpload();

  const setMediaFile = async (e) => {
    setImageToSend(e.target.files[0]);
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (imageToSend || desc.current.value) {
      setIsLoading(true);
    } else return;

    let imageURL = "";
    if (imageToSend) {
      imageURL = await uploadToCloudinary(imageToSend);
    }

    let newPost = {
      userId: user?._id,
      desc: desc.current.value,
      img: imageURL ? imageURL : null,
    };

    try {
      const res = await axios.post("/post", newPost, { withCredentials: true });
      setNewPost(res.data);

      setIsLoading(false);

      desc.current.value = "";
      setImageToSend("");
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-primary md:px-5 px-2 py-2 md:py-5 rounded-sm sm:rounded-md">
        <div
          className={`flex items-start space-x-3 md:space-x-4 ${
            isLoading ? "pointer-events-none opacity-50" : "pointer-events-auto"
          }`}
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-9 h-9 md:w-[44px] md:h-[44px] bg-cover rounded-full md:-ml-2"
          ></div>
          <div className="flex-1">
            <form onSubmit={submitHandler} className="flex-1">
              <div className="bg-secondary flex items-center px-2 py-2 md:px-3 md:py-2 rounded-md space-x-2 md:space-x-3">
                <input
                  ref={desc}
                  type="text"
                  placeholder={`What's on your mind ${user?.username}?`}
                  className="bg-transparent text-[13px] sm:text-[14px] md:text-[16px] lg:text-[15px] flex-1 outline-none placeholder-[#A9A9A9]"
                />

                <label htmlFor="addAPhoto">
                  <RiAttachment2
                    className="cursor-pointer text-[16px] sm:text-xl"
                    color="#b8b8b8"
                  />
                </label>
                <input
                  type="file"
                  id="addAPhoto"
                  className="hidden"
                  onChange={setMediaFile}
                  accept="image/png, image/jpg, image/jpeg"
                />

                <button type="submit">
                  <BsSendFill
                    color="#1da1f2"
                    className="text-[12px] sm:text-base"
                  />
                </button>
              </div>
            </form>
            <div
              className={`mt-5 ${
                isLoading
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto"
              } relative flex items-center justify-center ${
                imageToSend ? "block" : "hidden"
              }`}
            >
              <div
                onClick={() => {
                  setImageToSend(null);
                  imageRef.current.src = "";
                }}
                className="absolute border-4 border-secondary -top-2 -right-2 bg-accent w-7 h-7 cursor-pointer rounded-full grid place-content-center"
              >
                <IoIosClose color="white" className="text-xl" />
              </div>
              <div className="bg-secondary h-[300px] w-full">
                <img
                  src="#"
                  ref={imageRef}
                  alt="preview image"
                  className="object-contain h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center mt-5 bg-secondary py-2 rounded-sm">
          <ReactLoading type="spin" color="#1da1f2" height={24} width={24} />
        </div>
      )}

      <div className="mt-4 sm:mt-6">
        <Posts {...{ newPost }} />
      </div>
    </>
  );
}

export default Feed;
