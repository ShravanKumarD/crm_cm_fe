import axios from 'axios';

axios.defaults.baseURL = 'https://13.127.116.191:3000';
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
