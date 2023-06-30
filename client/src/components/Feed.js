import { useState, useEffect, useContext, useRef } from "react";
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
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imageToSend, setImageToSend] = useState("");
  const [totalPages, setTotalPages] = useState(0)

  const [loadingPosts, setLoadingPosts] = useState(false)
  const scrollRef = useRef(null)

  const setMediaFile = async (image) => {
    setImageToSend(image);
    imageRef.current.src = URL.createObjectURL(image);
  };

  useEffect(() => {
    if (page < totalPages) setLoadingPosts(true)

    const fetchPosts = async () => {
      const res = await axios.get(`/post/timeline/${user?._id}?pageNumber=${page}`);
      setTotalPages(res.data.max_page)
      setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
      setLoadingPosts(false)
    };

    fetchPosts();
  }, [page]);


  const handleScroll = () => {
    const container = scrollRef?.current
    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 1){
      setLoadingPosts(true)
      setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    const container = scrollRef.current
    container.addEventListener('scroll', handleScroll)

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

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
    <div ref={scrollRef} className="order-3 lg:order-2 w-full lg:w-6/12 lg:h-[85vh] overflow-y-auto scrollbar scrollbar-w-0">
      <div className="bg-bodySecondary px-5 md:px-6 py-5 rounded-md">
        <div
          className={`flex items-center space-x-3 md:space-x-4 ${
            loading ? "pointer-events-none opacity-50" : "pointer-events-auto"
          }`}
        >
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className={`w-8 h-8 md:w-[44px] md:h-[44px] bg-cover rounded-full -ml-2`}
          ></div>
          <form onSubmit={submitHandler} className={`flex-1`}>
            <div className="bg-[#28343e] flex flex-1 items-center px-3 py-2 rounded-md space-x-3">
              <input
                type="text"
                ref={desc}
                readOnly={loading}
                placeholder={`What's on your mind ${user?.username}?`}
                className={`bg-transparent text-[12px] sm:text-[13px] md:text-[16px] flex-1 rounded-md outline-none placeholder-[#617484]`}
              />

              <label htmlFor="addAPhoto" className="">
                <RiAttachment2
                  className="cursor-pointer text-[16px] sm:text-xl"
                  color="#c7d6e5"
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
        </div>

        <div
          className={`mt-10 ${
            loading ? "pointer-events-none opacity-50" : "pointer-events-auto"
          } relative flex items-center justify-center ${
            imageToSend ? "block" : "hidden"
          }`}
        >
          <div
            onClick={() => {
              setImageToSend(null);
              imageRef.current.src = "#";
            }}
            className="absolute -top-3 -right-3  bg-[#1da1f2] w-6 h-6 cursor-pointer rounded-full grid place-content-center"
          >
            <IoIosClose color="white" className="text-xl " />
          </div>
          <img
            ref={imageRef}
            src="#"
            alt="preview image"
            className="max-h-[400px] object-contain"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center mt-5 bg-[#1c2831] py-2 rounded-sm">
          <ReactLoading type="spin" color="white" height={24} width={24} />
        </div>
      )}

      <div className="mt-6">
        <Posts posts={posts} setPosts={setPosts} />
        {loadingPosts && (
           <div className="flex items-center justify-center py-2 rounded-sm">
             <ReactLoading type="spin" color="white" height={20} width={20} />
           </div>
         )}
      </div>
    </div>
  );
}

export default Feed;
