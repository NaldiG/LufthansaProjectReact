import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/admin/";

const getUserList = () => {
    return axios.get(API_URL + "allUsers", { headers: authHeader() });
};

const serachUsers = (username) => {
    return axios.post(API_URL + "findUsers", {
      username
    }, {
      headers: authHeader(),
    });
};

const processRequest = (userId, username, email) => {
    return axios.post(API_URL + "update", {
      userId,
      username,
      email,
    }, {
      headers: authHeader(),
    });
};

const deleteUser = (id) => {
    return axios.post(API_URL + "delete", {
        id
    }, {
        headers: authHeader(),
    });
};

const register = (username, email, password) => {
    return axios.post(API_URL + "create", {
      username,
      email,
      password,
    }, {
        headers: authHeader(),
    });
  };

export default {
    getUserList,
    serachUsers,
    processRequest,
    deleteUser,
    register,
};
  