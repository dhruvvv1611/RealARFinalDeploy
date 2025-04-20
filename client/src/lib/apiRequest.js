import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://myrealar.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;