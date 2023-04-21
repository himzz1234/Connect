import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { RiAttachment2 } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import Post from "./Post";
import { AuthContext } from "../context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import LoadingPost from "./LoadingPost";

function Feed() {
  const desc = useRef();
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [imageToSend, setImageToSend] = useState("");

  const setMediaFile = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "social-media");
    data.append("cloud_name", "dzcein87k");

    try {
      const imageURL = await axios.post(
        "https://api.cloudinary.com/v1_1/dzcein87k/image/upload",
        data
      );

      setImageToSend(imageURL.data.url.toString());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`/post/timeline/${user?._id}`);
      console.log(res.data);
      setPosts(
        res.data.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
      );
    };

    fetchPosts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    let newPost = {
      userId: user?._id,
      desc: desc.current.value,
      img: imageToSend,
    };

    try {
      const res = await axios.post("/post", newPost);
      setPosts((prev) => [res.data, ...prev]);

      desc.current.value = "";
      setImageToSend("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full lg:w-6/12 h-[600px] overflow-y-auto scrollbar scrollbar-w-0">
      <div className="bg-bodySecondary px-6 py-5 rounded-md">
        <div className="flex items-center space-x-4">
          <div
            style={{ backgroundImage: `url(${user?.profilePicture})` }}
            className="w-12 h-12 bg-cover rounded-full -ml-2"
          ></div>
          <form onSubmit={submitHandler} className="flex-1">
            <div className="bg-[#28343e] flex flex-1 items-center px-3 py-2 rounded-md space-x-2">
              <input
                type="text"
                ref={desc}
                placeholder={`What's on your mind ${user?.username}?`}
                className="bg-transparent flex-1 rounded-md outline-none placeholder-[#617484]"
              />

              <label htmlFor="addAPhoto" className="">
                <RiAttachment2
                  className="cursor-pointer text-xl"
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
            </div>
          </form>
        </div>

        {imageToSend && (
          <div className="mt-10 relative">
            <div
              onClick={() => setImageToSend(null)}
              className="absolute -top-3 right-0  bg-[#1da1f2] w-6 h-6 cursor-pointer rounded-full grid place-content-center"
            >
              <IoIosClose color="white" className="text-xl " />
            </div>
            <img
              src={imageToSend}
              className="w-full max-h-[300px] object-contain"
            />
          </div>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {posts.map((post) => (
          <AnimatePresence key={post._id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1, stiffness: 60, type: "spring" }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Post post={post} setPosts={setPosts} posts={posts} />
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}

export default Feed;
