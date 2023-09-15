import { Text } from "@radix-ui/themes";

export default function TodoDescription({description}: {description: string}){
	return (
		<Text as="div">{ description }</Text>
	)
}
