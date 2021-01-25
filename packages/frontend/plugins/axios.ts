import axios from 'axios'

axios.defaults.baseURL = process.env.BASE_URL || 'http://localhost:8300/'
