import { Text } from "@radix-ui/themes";

export default function TodoTitle({title}: {title: string}){
	return (
		<Text as="div" weight="bold">{ title }</Text>
	)
}
