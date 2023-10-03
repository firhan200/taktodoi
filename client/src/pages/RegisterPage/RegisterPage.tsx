import { EnvelopeClosedIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { Link as NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
	const { register } = useAuth()

	const [email, setEmail] = useState<string>('')
	const [name, setName] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')

	const submit = (e: React.FormEvent) => {
		e.preventDefault()

		//validate
		if(email === ""){
			setError('email cannot be empty')
			return
		}
		if(name === ""){
			setError('name cannot be empty')
			return
		}
		if(password === ""){
			setError('password cannot be empty')
			return
		}

		register(name, email, password)
	}

	return (
		<Box p="4">
			<Container size="1" my="9">
				<Text size="7">Join Us!</Text>
				<form onSubmit={submit}>
					{
						error !== "" ? 
						<Box>
							{ error }
						</Box>
						: null
					}
					<Flex mt="4" gap="4" direction="column">
						<Box>
							<TextField.Root>
								<TextField.Slot>
									<PersonIcon />
								</TextField.Slot>
								<TextField.Input size="3" placeholder="full name" required maxLength={100} value={name} onChange={e => setName(e.target.value)}/>
							</TextField.Root>
						</Box>
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
							Already have an account? <NavLink to="/login">Login</NavLink>
						</Text>
						<Box mt="3">
							<Button style={{ width: '100%' }} size="3" variant="soft" type="submit">
								Sign up
							</Button>
						</Box>
					</Flex>
				</form>
			</Container>
		</Box>
	)
}
