import { Text } from "@radix-ui/themes";

type TodoDateTypes = {
	date: Date
}

export default function TodoDate(props: TodoDateTypes){
	const { date } = props

	return (
		<Text as="div" role="todo-date">{ date.toDateString() }</Text>
	)
}
