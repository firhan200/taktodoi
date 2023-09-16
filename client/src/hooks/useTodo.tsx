import { createContext, useContext, useState } from "react";

export type Todo = {
	Id: number,
	Name: string,
	Description: string
}

type TodoContextState = {
	todos: Todo[],
	removeId: number | null,
	get: (id: number) => Todo | null,
	add: (name: string, description: string) => void,
	update: (id: number, name: string, description: string) => void,
	invokeRemove: (id: number | null) => void,
	remove: (id: number) => boolean,
}

export const TodoContext = createContext<TodoContextState | null>(null)

type RemoveId = TodoContextState["removeId"]

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
	const [todos, setTodos] = useState<Todo[]>([])
	const [removeId, setRemoveId] = useState<RemoveId>(null)

	const get = (id: number): Todo | null => {
		const todo = todos.find(t => t.Id === id)
		if(typeof todo === 'undefined'){
			return null
		}

		return todo
	}

	const add = (name: string, description: string) => {
		const newTodo = {
			Id: new Date().getTime(),
			Name: name,
			Description: description
		} as Todo

		setTodos([...todos, newTodo])
	}

	const update = (id: number, name: string, description: string) => {
		//find by id
		const todo = get(id)
		if(todo === null){
			return
		}

		const newTodos = todos.map(todo => {
			if(todo.Id === id){
				todo.Name = name
				todo.Description = description
			}

			return todo
		})

		setTodos(newTodos)
	}

	const remove = (id: number): boolean => {
		setTodos(todos.filter(t => t.Id !== id))

		return true
	}

	const invokeRemove = (id: RemoveId) => {
		setRemoveId(id)
	}

	return (
		<TodoContext.Provider value={{
			todos,
			removeId,
			get,
			add,
			update,
			remove,
			invokeRemove
		}}>
			{ children }
		</TodoContext.Provider>
	)
}


export const useTodo = () : TodoContextState => {
	const todoContext = useContext(TodoContext)
	if(todoContext === null){
		throw new Error("TodoContext should be within TodoContext.Provider")
	}
	
	return todoContext as TodoContextState
}
