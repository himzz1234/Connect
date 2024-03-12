import axios from "axios";

// http://localhost:8800

const instance = axios.create({
  baseURL: "http://localhost:8800/api",
});

export default instance;
