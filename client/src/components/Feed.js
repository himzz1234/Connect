import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "../axios";
import { RiAttachment2 } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import ReactLoading from "react-loading";
import Posts from "./Posts";
import useCloudinaryUpload from "../hooks/useCloudinaryUpload";
import { motion } from "framer-motion";

function Feed() {
  const desc = useRef();
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const [page, setPage] = useState(1);
  const { user } = useContext(AuthContext);
  const [newPost, setNewPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageToSend, setImageToSend] = useState("");
  const { uploadToCloudinary } = useCloudinaryUpload();

  const setMediaFile = async (e) => {
    setImageToSend(e.target.files[0]);
    imageRef.current.src = URL.createObjectURL(e.target.files[0]);
  };

  const handleScroll = () => {
    const container = containerRef?.current;
    if (window.innerWidth >= 1024) {
      if (
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 10
      ) {
        setPage((prev) => prev + 1);
      }
    } else {
      if (
        document.querySelector(".outer-section").scrollHeight -
          document.querySelector(".outer-section").scrollTop <=
        window.innerHeight + 10
      ) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    document
      .querySelector(".outer-section")
      .addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      document
        .querySelector(".outer-section")
        .removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addAPost = async (newPost) => {
    const res = await axios.post("/post", newPost);

    setNewPost(res.data);
    setIsLoading(false);

    desc.current.value = "";
    setImageToSend("");
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
      await addAPost(newPost);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="feed order-3 lg:order-2 w-full lg:w-6/12 lg:h-full overflow-y-auto scrollbar scrollbar-w-0"
    >
      <div className="bg-primary px-5 md:px-6 py-5 rounded-md">
        <div
          className={`flex items-start space-x-3 md:space-x-4 ${
            isLoading ? "pointer-events-none opacity-50" : "pointer-events-auto"
          }`}
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-8 h-8 md:w-[44px] md:h-[44px] bg-cover rounded-full -ml-2"
          ></div>
          <div className="flex-1">
            <form onSubmit={submitHandler} className="flex-1">
              <div className="bg-secondary flex items-center px-3 py-2 rounded-md space-x-3">
                <input
                  ref={desc}
                  type="text"
                  placeholder={`What's on your mind ${user?.username}?`}
                  className="bg-transparent text-[12px] sm:text-[13px] md:text-[16px] flex-1 outline-none placeholder-[#A9A9A9]"
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
                  name="addAPhoto"
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

      <div className="mt-6">
        <Posts {...{ page, setPage, newPost }} />
      </div>
    </div>
  );
}

export default Feed;
