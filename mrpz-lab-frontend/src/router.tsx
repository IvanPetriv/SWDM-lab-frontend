import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="home" element={<HomePage />} />
			</Routes>
		</BrowserRouter>
	)
}
