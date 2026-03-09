import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-system-1-bd69.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
