import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../axios";
import { RiAttachment2 } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { BsSendFill } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import ReactLoading from "react-loading";
import Posts from "./Posts";

function Feed() {
  const desc = useRef();
  const imageRef = useRef(null);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageToSend, setImageToSend] = useState("");
  const [hasMoreData, setHasMoreData] = useState(true);

  const [loadingPosts, setLoadingPosts] = useState(false);
  const scrollRef = useRef(null);

  const setMediaFile = async (image) => {
    setImageToSend(image);
    imageRef.current.src = URL.createObjectURL(image);
  };

  useEffect(() => {
    setLoadingPosts(true);

    const fetchPosts = async () => {
      const res = await axios.get(
        `/post/timeline/${user?._id}?pageNumber=${page}`
      );
      if (res.data.posts.length == 0) {
        setHasMoreData(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      }
      setLoadingPosts(false);
    };

    if (hasMoreData) {
      fetchPosts();
    }
  }, [page, hasMoreData]);

  const handleScroll = () => {
    const container = scrollRef?.current;
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
    const container = scrollRef.current;
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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (imageToSend || desc.current.value) {
      setLoading(true);
    }

    let imageURL = "";
    if (imageToSend) {
      try {
        const data = new FormData();
        data.append("file", imageToSend);
        data.append("upload_preset", "social-media");
        data.append("cloud_name", "dzcein87k");

        imageURL = await axios.post(
          "https://api.cloudinary.com/v1_1/dzcein87k/image/upload",
          data
        );
      } catch (err) {
        console.log(err);
      }
    }

    let newPost = {
      userId: user?._id,
      desc: desc.current.value,
      img: imageURL ? imageURL.data.url.toString() : null,
    };

    if (imageToSend === "" && desc.current.value === "") return;

    try {
      const res = await axios.post("/post", newPost);
      setLoading(false);
      setPosts((prev) => [res.data, ...prev]);

      desc.current.value = "";
      setImageToSend("");
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="order-3 lg:order-2 w-full lg:w-6/12 lg:h-full overflow-y-auto scrollbar scrollbar-w-0"
    >
      <div className="bg-bodyPrimary px-5 md:px-6 py-5 rounded-md">
        <div
          className={`flex items-start space-x-3 md:space-x-4 ${
            loading ? "pointer-events-none opacity-50" : "pointer-events-auto"
          }`}
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className={`w-8 h-8 md:w-[44px] md:h-[44px] bg-cover rounded-full -ml-2`}
          ></div>
          <div className="flex-1">
            <form onSubmit={submitHandler} className={`flex-1`}>
              <div className="bg-bodySecondary flex items-center px-3 py-2 rounded-md space-x-3">
                <input
                  type="text"
                  ref={desc}
                  readOnly={loading}
                  placeholder={`What's on your mind ${user?.username}?`}
                  className={`bg-transparent text-[12px] sm:text-[13px] md:text-[16px] flex-1 rounded-md outline-none placeholder-[#A9A9A9]`}
                />

                <label htmlFor="addAPhoto" className="">
                  <RiAttachment2
                    className="cursor-pointer text-[16px] sm:text-xl"
                    color="#b8b8b8"
                  />
                </label>
                <input
                  type="file"
                  id="addAPhoto"
                  name="addAPhoto"
                  accept="image/png, image/jpg, image/jpeg"
                  className="hidden"
                  onChange={(e) => setMediaFile(e.target.files[0])}
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
                loading
                  ? "pointer-events-none opacity-50"
                  : "pointer-events-auto"
              } relative flex items-center justify-center ${
                imageToSend ? "block" : "hidden"
              }`}
            >
              <div
                onClick={() => {
                  setImageToSend(null);
                  imageRef.current.src = "#";
                }}
                className="absolute border-4 border-bodySecondary -top-2 -right-2 bg-[#1da1f2] w-7 h-7 cursor-pointer rounded-full grid place-content-center"
              >
                <IoIosClose color="white" className="text-xl " />
              </div>
              <div className="bg-bodySecondary h-[300px] w-full">
                <img
                  ref={imageRef}
                  src="#"
                  alt="preview image"
                  className="object-contain h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-5 bg-bodySecondary py-2 rounded-sm">
          <ReactLoading type="spin" color="#1da1f2" height={24} width={24} />
        </div>
      )}

      <div className="mt-6">
        <Posts posts={posts} setPosts={setPosts} />
        {loadingPosts && hasMoreData && (
          <div className="flex items-center justify-center mt-5 py-2">
            <ReactLoading type="spin" color="white" height={24} width={24} />
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(Feed);
