import axios from 'axios';

// axios.defaults.baseURL = 'http://13.127.116.191:3000';
axios.defaults.baseURL= 'https://backend.crm.creditmitra.in';
// axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
