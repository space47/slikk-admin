import { setupInterceptorsTo } from "./Interceptors";
import axios from "axios";
axios.defaults.baseURL = 'https://dev-api.slikk.club/';
const axioisInstance = setupInterceptorsTo(axios);
export default axioisInstance;
