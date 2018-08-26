import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-a2f78.firebaseio.com/',
});

export default instance;
