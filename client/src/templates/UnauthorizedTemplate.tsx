import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UnauthorizedTemplate() {
	const { isAuth } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if(isAuth){
			navigate("/")
		}
	}, [isAuth])

	return (
		<Suspense fallback="Loading...">
			<Outlet />
		</Suspense>
	)
}
