import axios, { type AxiosInstance } from "axios";
import StudentApi from "./student-api";
import AuthApi from "./auth-api";

// Address of backend API endpoints
const apiAddress = "https://localhost:7217/api/v1";

// Creates an axios instance that will be shared across service APIs
const axiosInstance: AxiosInstance = axios.create({
	baseURL: apiAddress,
	timeout: 50000, // Keep it for testing purposes
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		// "Authorization": `Bearer ${useJwtTokenStore.getState().jwtToken ?? ""}`
	},
});

// Instances of service APIs
export const authApiInstance = new AuthApi(axiosInstance);
export const studentApiInstance = new StudentApi(axiosInstance);



