import { Flex } from "@radix-ui/themes";
import TodoCard from "../../molecules/TodoCard/TodoCard";
import { useTodo } from "../../hooks/useTodo";

export default function TodoList() {
	const { todos } = useTodo()

	return (
		<Flex direction="column" gap="4" mt="4">
			{
				todos.map((todo, index) => <TodoCard todo={todo} key={index}/>)
			}
		</Flex>
	)
}
