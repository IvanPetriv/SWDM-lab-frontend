import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import SignupPage from "./pages/signup-page";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="home" element={<HomePage />} />
				<Route path="auth">
					<Route path="login" element={<LoginPage />} />
					<Route path="signup" element={<SignupPage />} />
				</Route>
				<Route path="*" element={<LoginPage />} /> {/*Temporary*/}
			</Routes>
		</BrowserRouter>
	)
}
