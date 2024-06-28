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
  styles: `
    :host {
      width: 80vw;
      max-width: 500px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}
