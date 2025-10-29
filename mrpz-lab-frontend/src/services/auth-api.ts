import type { AxiosInstance } from "axios";
import type { UserGetDto } from "../types/api-dtos";
import BaseApi from "./base-api";
import type { UserLogin, UserSignup } from "../types/auth-types";


export default class AuthApi extends BaseApi {
	constructor(instance: AxiosInstance, endpoint: string = "Auth") {
		super(instance, endpoint);
	}

	// Get a student by ID
	async login(user: UserLogin): Promise<UserGetDto> {
		return this.post(`login`, user);
	}

	// Create a new student
	async signup(user: UserSignup): Promise<UserGetDto> {
		return this.post(`signup`, user);
	}
}
