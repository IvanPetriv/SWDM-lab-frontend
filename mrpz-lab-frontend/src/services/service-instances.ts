import axios from "axios";

const apiAddress = "https://localhost:7217/api/v1";


const axiosInstance = axios.create({
	baseURL: apiAddress,
	timeout: 50000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		// "Authorization": `Bearer ${useJwtTokenStore.getState().jwtToken ?? ""}`
	},
});
