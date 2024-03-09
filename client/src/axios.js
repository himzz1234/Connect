import axios from "axios";

// http://localhost:8800
// https://connectsocialapp.onrender.com/api
const instance = axios.create({
  baseURL: "http://localhost:8800/api",
});

export default instance;
