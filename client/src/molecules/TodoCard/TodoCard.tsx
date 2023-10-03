import { MagnifyingGlassIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Grid, IconButton } from "@radix-ui/themes";
import TodoTitle from "../../atoms/TodoTitle/TodoTitle";
import TodoDescription from "../../atoms/TodoDescription/TodoDescription";
import TodoDate from "../../atoms/TodoDate/TodoDate";
import { Todo, useTodo } from "../../hooks/useTodo";

export default function TodoCard({ todo }: { todo: Todo }) {
	const { Id, Name, Description } = todo
	const { invokeRemove } = useTodo()
	
	return (
		<Card>
			<Grid columns="3" align="center" justify="between">
				<Box>
					<TodoTitle title={ Name }/>
					<TodoDescription description={ Description }/>
				</Box>
				<TodoDate date={new Date()}/>
				<Flex gap="3" justify="end">
					<IconButton variant="soft">
						<MagnifyingGlassIcon width="18" height="18" />
					</IconButton>
					<IconButton variant="soft">
						<Pencil1Icon width="18" height="18" />
					</IconButton>
					<IconButton onClick={() => invokeRemove(Id)} variant="soft">
						<TrashIcon width="18" height="18" />
					</IconButton>
				</Flex>
			</Grid>
		</Card>
	)
}
