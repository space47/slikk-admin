import { setupInterceptorsTo } from "./Interceptors";
import axios from "axios";
axios.defaults.baseURL = process.env.BACKEND_URI;
const axioisInstance = setupInterceptorsTo(axios);
export default axioisInstance;
