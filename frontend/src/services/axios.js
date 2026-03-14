import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-system-ksbv.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
