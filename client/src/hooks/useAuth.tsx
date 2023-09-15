import { createContext, useContext, useState } from "react";

type AuthContextState = {
	isAuth: boolean,
	login: (token: string) => void
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
		if(token === ""){
			return false
		}
		
		return true
	}

	const login = (token: string) => {
		document.cookie = `token=${token}; expires=${new Date()}`
		setIsAuth(true)
	}

	return <AuthContext.Provider value={{
		isAuth,
		login
	}}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext) as AuthContextState

	return context
}
