import { Button, Text } from "@radix-ui/themes";
import TodoList from "../../organisms/TodoList/TodoList";
import { PlusIcon } from "@radix-ui/react-icons";

export default function HomePage() {
	return (
		<div>
			<Text as="div" size="8" mb="4">Welcome, <b>John</b></Text>
			<Button variant="soft">
				<PlusIcon />
				Create Todo
			</Button>
			<TodoList />
		</div>
	)
}
