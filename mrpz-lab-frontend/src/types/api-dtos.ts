// DTOs for User-related API responses
export interface UserGetDto {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
}

// As the backend has these types inherited from User, they have the same fields
export type StudentGetDto = UserGetDto
export type StudentCreateDto = Omit<StudentGetDto, "id">
export type TeacherGetDto = UserGetDto
export type TeacherCreateDto = Omit<TeacherGetDto, "id">
export type AdministratorGetDto = UserGetDto
