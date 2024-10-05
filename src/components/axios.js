import axios from 'axios';

// axios.defaults.baseURL= 'https://backend.crm.creditmitra.in/api';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
