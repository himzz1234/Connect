import axios from "axios";

const instance = axios.create({
  baseURL: "https://connectsocialmedia.onrender.com/api",
});

export default instance;
