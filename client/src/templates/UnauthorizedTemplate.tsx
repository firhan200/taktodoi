import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Container } from "@radix-ui/themes";

export default function UnauthorizedTemplate() {
	const { isAuth } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (isAuth) {
			navigate("/")
		}
	}, [isAuth])

	return (
		<Container>
			<Suspense fallback="Loading...">
				<Outlet />
			</Suspense>
		</Container>
	)
}
