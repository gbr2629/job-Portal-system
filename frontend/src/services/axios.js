import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000"
  baseURL:"https://job-portal-system-ksbv.onrender.com"
});

export default API;