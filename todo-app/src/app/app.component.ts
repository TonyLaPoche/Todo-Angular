import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from "@angular/common";
import {TodosComponent} from "./views/todos/todos.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, TodosComponent],
  template: `
    <h1>Todo List</h1>
    <app-todos></app-todos>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
