import { EnvelopeClosedIcon, LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Flex, Text, TextField } from "@radix-ui/themes";
import { Link as NavLink } from "react-router-dom";

export default function LoginPage() {
	return (
		<Box p="4">
			<Container size="1" my="9">
				<Text size="7">Join Us!</Text>
				<form>
					<Flex mt="4" gap="4" direction="column">
						<Box>
							<TextField.Root>
								<TextField.Slot>
									<PersonIcon />
								</TextField.Slot>
								<TextField.Input size="3" placeholder="full name" required maxLength={100} />
							</TextField.Root>
						</Box>
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
