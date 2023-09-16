import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useTodo } from "../../hooks/useTodo";

export default function DeleteTodoDialog() {
	const { removeId, invokeRemove } = useTodo()

	return (
		<AlertDialog.Root open={ removeId !== null }>
			<AlertDialog.Content style={{ maxWidth: 450 }}>
				<AlertDialog.Title>Revoke access</AlertDialog.Title>
				<AlertDialog.Description size="2">
					Are you sure? This application will no longer be accessible and any
					existing sessions will be expired.
				</AlertDialog.Description>

				<Flex gap="3" mt="4" justify="end">
					<Button onClick={() => invokeRemove(null)} variant="soft" color="gray">
						Cancel
					</Button>
					<Button variant="solid" color="red">
						Revoke access
					</Button>
				</Flex>
			</AlertDialog.Content>
		</AlertDialog.Root>
	)
}
