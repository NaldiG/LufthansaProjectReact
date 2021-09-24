import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getRequstList = () => {
  return axios.get(API_URL + "allUserRequests", { headers: authHeader() });
};

const update = async (username, email, password) => {
  const response = await axios.post(API_URL + "update", {
    username,
    email,
    password,
  }, {
    headers: authHeader(),
  });
  if (response.data.accessToken) {
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const requestDays = (daysRequested, daysLeft, reason) => {
  return axios.post(API_URL + "request", {
    daysRequested,
    daysLeft,
    reason,
  }, {
    headers: authHeader(),
  });
};

const deleteRequest = (id) => {
  return axios.post(API_URL + "deleteRequest", {
    id
  }, {
    headers: authHeader(),
  });
};

export default {
  getPublicContent,
  update,
  requestDays,
  getRequstList,
  deleteRequest,
};
