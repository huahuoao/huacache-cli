import axios from 'axios';
import { getBaseURL } from './config';

const instance = axios.create({
  baseURL: getBaseURL(), // 使用 config 中的 baseURL
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default instance;
