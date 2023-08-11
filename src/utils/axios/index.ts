import axios from 'axios';

const instance = axios.create({

  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,  
  timeout: 10000,
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'multipart/form-data', 
  },
});

export default instance;
