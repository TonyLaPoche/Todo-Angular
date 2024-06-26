import {Injectable, signal} from '@angular/core';
import {Todo, Todos} from "./todos.model";

@Injectable({
    providedIn: 'root'
})
export class TodosService {

    #todos = signal<Todos>([
        {
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        },
        {
            "userId": 1,
            "id": 2,
            "title": "quis ut nam facilis et officia qui",
            "completed": true
        },
        {
            "userId": 1,
            "id": 3,
            "title": "fugiat veniam minus",
            "completed": false
        },
    ]);
    todos = this.#todos.asReadonly()

    addTodo(todo: Todo) {
      this.#todos.update((todos) => [todo, ...todos] )
    }

    deleteTodo(id: number) {
        this.#todos.update((todos) => todos.filter((todo) => todo.id !== id) )
    }

    updateTodo(id: number, updatedTodo: Partial<Todo>) {
        this.#todos.update((todos) => {
            todos.forEach((todo) => {
                if (todo.id === id) {
                    Object.assign(todo, updatedTodo);
                }
            });
            return todos;
        });
    }

//     Check method update avec HashMap

}
