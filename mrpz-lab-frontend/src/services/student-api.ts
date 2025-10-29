import type { AxiosInstance } from "axios";
import type { StudentCreateDto, StudentGetDto } from "../types/api-dtos";

export default class StudentApi {
	private instance: AxiosInstance;
	private endpoint: string;

	constructor(instance: AxiosInstance, endpoint: string = "Student") {
		this.instance = instance;
		this.endpoint = endpoint;
	}

	// Get a student by ID
	async getStudentById(id: string): Promise<StudentGetDto> {
		const response =  await this.instance.get<StudentGetDto>(`${this.endpoint}/${id}`);
		return response.data;
	}

	// Create a new student
	async createStudent(student: StudentCreateDto): Promise<StudentGetDto> {
		const response = await this.instance.post<StudentGetDto>(`${this.endpoint}`, student);
		return response.data;
	}
}
