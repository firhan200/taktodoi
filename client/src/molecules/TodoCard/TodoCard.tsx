import { MagnifyingGlassIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Card, Flex, Grid, IconButton, Text } from "@radix-ui/themes";
import TodoTitle from "../../atoms/TodoTitle/TodoTitle";
import TodoDescription from "../../atoms/TodoDescription/TodoDescription";
import TodoDate from "../../atoms/TodoDate/TodoDate";

export default function TodoCard() {
	return (
		<Card>
			<Grid columns="3" align="center" justify="between">
				<Box>
					<TodoTitle title="this is title"/>
					<TodoDescription description="Lorem ipsum dolor sir amet"/>
				</Box>
				<TodoDate date="2 minutes ago"/>
				<Flex gap="3" justify="end">
					<IconButton variant="soft">
						<MagnifyingGlassIcon width="18" height="18" />
					</IconButton>
					<IconButton variant="soft">
						<Pencil1Icon width="18" height="18" />
					</IconButton>
					<IconButton variant="soft">
						<TrashIcon width="18" height="18" />
					</IconButton>
				</Flex>
			</Grid>
		</Card>
	)
}
