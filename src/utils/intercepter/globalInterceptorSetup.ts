import { setupInterceptorsTo } from './Interceptors'
import axios from 'axios'
import { getRuntimeBackendURI } from '@/utils/runtimeConfig'

const BASE_URL = getRuntimeBackendURI()
console.log(BASE_URL)

axios.defaults.baseURL = BASE_URL
const axioisInstance = setupInterceptorsTo(axios)
export default axioisInstance
