import { PlusIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text, TextArea, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useTodo } from "../../hooks/useTodo";

export default function AddTodo() {
	const { add } = useTodo()

	const [open, setOpen] = useState<boolean>(false)
	const [name, setName] = useState<string>('')
	const [description, setDescription] = useState<string>('')

	const resetForm = () => {
		setName('')
		setDescription('')
	}

	const submit = (e: React.FormEvent) => {
		e.preventDefault()

		add(name, description)
		setOpen(false)
		resetForm()
	}

	return (
		<Dialog.Root open={open}>
			<Button variant="soft" onClick={() => setOpen(true)}>
				<PlusIcon />
				Create Todo
			</Button>

			<Dialog.Content style={{ maxWidth: 450 }}>
				<Dialog.Title>Create new Todo</Dialog.Title>
				<Dialog.Description size="2" mb="4">
					Input <b>Name</b> and <b>Description</b> below:
				</Dialog.Description>

				<form onSubmit={submit}>
					<Flex direction="column" gap="3">
						<label>
							<Text as="div" size="3" mb="1" weight="bold">
								Name
							</Text>
							<TextField.Input
								value={name}
								onChange={e => setName(e.target.value)}
								maxLength={100}
								required
							/>
							<Text as="div" align="right">
								{`${name.length}/100`}
							</Text>
						</label>
						<label>
							<Text as="div" size="3" mb="1" weight="bold">
								Email
							</Text>
							<TextArea
								value={description}
								onChange={e => setDescription(e.target.value)}
								maxLength={200}
								required
							/>
							<Text as="div" align="right">
								{`${description.length}/200`}
							</Text>
						</label>
					</Flex>

					<Flex gap="3" mt="4" justify="end">
						<Button onClick={() => setOpen(false)} size="3" variant="soft" color="gray">
							Cancel
						</Button>
						<Button type="submit" size="3">Save</Button>
					</Flex>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	)
}
