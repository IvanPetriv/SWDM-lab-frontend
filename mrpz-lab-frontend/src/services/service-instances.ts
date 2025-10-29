import axios, { type AxiosInstance } from 'axios';
import StudentApi from './student-api';

// Address of backend API endpoints - using environment variable
const apiAddress =
  import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5287';

// Creates an axios instance that will be shared across service APIs
const axiosInstance: AxiosInstance = axios.create({
  baseURL: apiAddress,
  timeout: 50000, // Keep it for testing purposes
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // "Authorization": `Bearer ${useJwtTokenStore.getState().jwtToken ?? ""}`
  },
});

// Instances of service APIs
export const studentApiInstance = new StudentApi(axiosInstance);
