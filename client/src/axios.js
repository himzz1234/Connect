import axios from "axios";

// http://localhost:8800
const instance = axios.create({
  baseURL: "https://connectsocialapp.onrender.com/api",
});

export default instance;
