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
            "title": "Récupérer les todos",
            "completed": true,
            "priority": 1,

        },
        {
            "userId": 1,
            "id": 2,
            "title": "Ajouter une todo",
            "completed": true,
            "priority": 2,
        },
        {
            "userId": 1,
            "id": 3,
            "title": "Modifier une todo",
            "completed": true,
            "priority": 3,
        },{
            "userId": 1,
            "id": 4,
            "title": "Supprimer une todo",
            "completed": true,
            "priority": 4,
        },{
            "userId": 1,
            "id": 5,
            "title": "déplacer une todo",
            "completed": false,
            "priority": 5
        },{
            "userId": 1,
            "id": 6,
            "title": "trier les todos",
            "completed": false,
            "priority": 6
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
    sortby(key: keyof Todo) {
        this.#todos.update((todos) => {
            return todos.slice().sort((a, b) => {
                if (key === 'priority' || key === 'id') {
                    return (a[key] as number) - (b[key] as number);
                } else if (key === 'completed') {
                    return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
                }
                return 0;
            });
        });
    }
}
