import axios from 'axios';


// axios.defaults.baseURL = process.env.BASE_URL;
// axios.defaults.timeout = 10000; 

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';





export default axios;
