import { Flex } from "@radix-ui/themes";
import TodoCard from "../../molecules/TodoCard/TodoCard";

export default function TodoList() {
	return (
		<Flex direction="column" gap="4" mt="4">
			{
				[...Array(10)].map(i => <TodoCard key={i}/>)
			}
		</Flex>
	)
}
