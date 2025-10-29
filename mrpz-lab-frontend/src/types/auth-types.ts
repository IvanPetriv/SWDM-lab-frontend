export interface UserSignup {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface UserLogin {
	email: string;
	password: string;
}
