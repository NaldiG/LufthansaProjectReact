import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/test/";

const getModeratorBoard = () => {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  };

export default {
    getModeratorBoard,
};
  