import axios, { AxiosError } from "axios";
import { createContext, useContext, useState } from "react";

type LoginResponse = {
	errors?: string,
	token?: string
}

const API_URL = import.meta.env.VITE_API_URL ?? ""

type AuthContextState = {
	isAuth: boolean,
	login: (email: string, password: string) => Promise<string>,
	register: (fullName: string, email: string, password: string) => Promise<string>
}

const AuthContext = createContext<AuthContextState | null>(null)

function getCookie(cname: string) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState<boolean>(checkIfAuth())

	function checkIfAuth() {
		const token = getCookie("token")
		if (token === "") {
			return false
		}

		return true
	}

	const login = async (email: string, password: string): Promise<string> => {
		try {
			const res = await axios.post(`${API_URL}users/login`, {
				email: email,
				password: password
			})

			const respData = res.data as LoginResponse

			document.cookie = `token=${respData.token}; expires=${new Date()}`
			setIsAuth(true)
		}catch(err){
			const axiosErr = err as AxiosError
			const respData = axiosErr.response?.data as LoginResponse
			return respData.errors!
		}

		return ""
	}

	const register = async (fullName: string, email: string, password: string): Promise<string> => {
		const res = await axios.post(`${API_URL}users`, {
			full_name: fullName,
			email: email,
			password: password
		})

		const data = res.data

		return ""
	}

	return <AuthContext.Provider value={{
		isAuth,
		login,
		register
	}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext) as AuthContextState

	return context
}
