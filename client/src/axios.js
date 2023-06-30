import axios from "axios";

const instance = axios.create({
  baseURL: "https://connectsocialapp.onrender.com/api",
});

export default instance;
