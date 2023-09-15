import { Container } from "@radix-ui/themes";
import { Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthorizedTemplate() {
	const { isAuth } = useAuth()
	const navigate = useNavigate()

	console.log(isAuth)

	useEffect(() => {
		if(!isAuth){
			navigate("/login")
		}
	}, [isAuth])

	return (
		<Container>
			<Suspense fallback="loading">
				<Outlet />
			</Suspense>
		</Container>
	)
}
