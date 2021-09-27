import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/mod/";

const getRequestList = () => {
  return axios.get(API_URL + "allRequests", { headers: authHeader() });
};

const searchRequests = (username) => {
  return axios.post(API_URL + "searchRequests", {
    username
  }, {
    headers: authHeader(),
  });
};

const processRequest = (userId, requestId, daysRequested, daysLeft, status, response) => {
  return axios.post(API_URL + "response", {
    userId,
    requestId,
    daysRequested,
    daysLeft,
    status,
    response,
  }, {
    headers: authHeader(),
  });
};

export default {
  getRequestList,
  searchRequests,
  processRequest,
};
  