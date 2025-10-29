import type { AxiosInstance } from "axios";
import type { StudentCreateDto, StudentGetDto } from "../types/api-dtos";
import BaseApi from "./base-api";

export default class StudentApi extends BaseApi {
	constructor(instance: AxiosInstance, endpoint: string = "Student") {
		super(instance, endpoint);
	}

	// Get a student by ID
	async getStudentById(id: string): Promise<StudentGetDto> {
		return this.get(`${id}`);
	}

	// Create a new student
	async createStudent(student: StudentCreateDto): Promise<StudentGetDto> {
		return this.post(``, student);
	}
}
