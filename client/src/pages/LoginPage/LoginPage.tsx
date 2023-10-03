import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, Text, TextField } from "@radix-ui/themes";
import { Link as NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
	const { login } = useAuth()

	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()

		const err = await login(email, password)
		setError(err)
	}

	return (
		<Container size="1" my="9">
			<Box p="4">
				<Text size="7">Welcome</Text>
				<form onSubmit={submit}>
					{
						error !== "" ? (
							<Box>
								{error}
							</Box>
						) : null
					}
					<Flex mt="4" gap="4" direction="column">
						<Box>
							<TextField.Root>
								<TextField.Slot>
									<EnvelopeClosedIcon />
								</TextField.Slot>
								<TextField.Input size="3" placeholder="email address" required maxLength={100} value={email} onChange={e => setEmail(e.target.value)}/>
							</TextField.Root>
						</Box>
						<Box>
							<TextField.Root>
								<TextField.Slot>
									<LockClosedIcon />
								</TextField.Slot>
								<TextField.Input size="3" placeholder="password" type="password" required maxLength={20} value={password} onChange={e => setPassword(e.target.value)}/>
							</TextField.Root>
						</Box>
						<Text align="center">
							Don't have account? <NavLink to="/register">Sign up</NavLink>
						</Text>
						<Box mt="3">
							<Button style={{ width: '100%' }} size="3" variant="soft" type="submit">
								Login
							</Button>
						</Box>
					</Flex>
				</form>
			</Box>
		</Container>
	)
}
