import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Todo, Todos, TodosService} from "./shared/services/todos.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  template: `
    <h1>Todo List</h1>
    <ul>
      @for (todo of todos(); track $index) {
        <li>
          {{todo.title}}
        </li>
      }
    </ul>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  todoService = inject(TodosService)
  todos = signal<Todos>([])
  constructor() {
    this.todoService.todos$.subscribe((data) => {
      this.todos.set(data)
    });
  }
}
