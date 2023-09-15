import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Container, Flex, Text, TextField } from "@radix-ui/themes";
import { Link as NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
	const { login } = useAuth()

	const submit = (e: React.FormEvent) => {
		e.preventDefault()

		login("secret")
	}

	return (
		<Container size="1" my="9">
			<Card>
				<Box p="4">
					<Text size="7">Welcome</Text>
					<form onSubmit={submit}>
						<Flex mt="4" gap="4" direction="column">
							<Box>
								<TextField.Root>
									<TextField.Slot>
										<EnvelopeClosedIcon />
									</TextField.Slot>
									<TextField.Input size="3" placeholder="email address" required maxLength={100} />
								</TextField.Root>
							</Box>
							<Box>
								<TextField.Root>
									<TextField.Slot>
										<LockClosedIcon />
									</TextField.Slot>
									<TextField.Input size="3" placeholder="password" type="password" required maxLength={20} />
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
			</Card>
		</Container>
	)
}
