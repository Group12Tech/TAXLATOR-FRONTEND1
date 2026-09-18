import { lazy } from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../state/RequireAuth";

const History = lazy(() => import("../pages/otherPages/History"));

const ProtectedRoutes = [
	<Route
		key="/history"
		path="/history"
		element={
			<RequireAuth>
				<History />
			</RequireAuth>
		}
	/>,
];

export default ProtectedRoutes;