import { useState } from "react";
import axios from "../axios";

function useCloudinaryUpload() {
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (image) => {
    if (!image) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "social-media");
    data.append("cloud_name", "dzcein87k");

    try {
      const file = await axios.post(
        "https://api.cloudinary.com/v1_1/dzcein87k/image/upload",
        data
      );

      setLoading(false);
      return file.data.url.toString();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return {
    uploadToCloudinary,
    loading,
  };
}

export default useCloudinaryUpload;
