import { Text } from "@radix-ui/themes";
import TodoList from "../../organisms/TodoList/TodoList";
import AddTodo from "../../organisms/AddTodo/AddTodo";
import { TodoProvider } from "../../hooks/useTodo";
import DeleteTodoDialog from "../../molecules/DeleteTodoDialog/DeleteTodoDialog";

export default function HomePage() {
	return (
		<div>
			<Text as="div" size="8" mb="4">Welcome, <b>John</b></Text>
			<TodoProvider>
				<AddTodo />
				<TodoList />
				<DeleteTodoDialog />
			</TodoProvider>
		</div>
	)
}
