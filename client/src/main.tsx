import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import '@radix-ui/themes/styles.css';
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UnauthorizedTemplate from './templates/UnauthorizedTemplate';
import AuthorizedTemplate from './templates/AuthorizedTemplate';
import { Theme } from '@radix-ui/themes';
import { AuthProvider } from './hooks/useAuth';

const router = createBrowserRouter([
	{
		element: <UnauthorizedTemplate />,
		children: [
			{
				path: "login",
				Component: lazy(() => import('./pages/LoginPage/LoginPage'))
			},
			{
				path: "register",
				Component: lazy(() => import('./pages/RegisterPage/RegisterPage'))
			}
		]
	},
	{
		element: <AuthorizedTemplate />,
		children: [
			{
				path: "/",
				Component: lazy(() => import('./pages/HomePage/HomePage'))
			}
		]
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<Theme>
				<RouterProvider router={router} />
			</Theme>
		</AuthProvider>
	</React.StrictMode>,
)
