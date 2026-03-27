import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://qng52u44o40sxojnxlxydscm.hosting.codeyourfuture.io/api"
    : "http://localhost:5000/api");

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;