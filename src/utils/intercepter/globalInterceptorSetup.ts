import { setupInterceptorsTo } from "./Interceptors";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URI;
console.log(BASE_URL);

axios.defaults.baseURL = BASE_URL;
const axioisInstance = setupInterceptorsTo(axios);
export default axioisInstance;
