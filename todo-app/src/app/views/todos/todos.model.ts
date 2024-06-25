export type Todos = Todo[]

export interface Todo {
    userId: number
    id: number
    title: string
    completed: boolean
}