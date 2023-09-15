import { Text } from "@radix-ui/themes";

export default function TodoDate({date}: {date: string}){
	return (
		<Text as="div">{ date }</Text>
	)
}
