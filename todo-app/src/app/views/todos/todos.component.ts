import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TodosService} from "./todos.service";
import {TodoComponent} from "./todo/todo.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-todos',
    standalone: true,
  imports: [
    TodoComponent,
    ReactiveFormsModule,
    JsonPipe,
  ],
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <input type="text" formControlName="todoTitle"/>
            <button type="submit">Add</button>
        </form>
        @if (form.controls.todoTitle.errors; as error) {
          @if (error['required'] && form.controls.todoTitle.dirty && form.controls.todoTitle.touched ) {
            <p class="error">
              Some value is required
            </p>
          }
          @if (error['minlength']; as minLengthErr) {
            <p class="error">
              {{ minLengthErr['actualLength'] }} /
              {{ minLengthErr['requiredLength'] }} Minimum length required
            </p>
          }
        }
        <ul class="todos-container">
            @for (todo of todos(); track todo.id) {
                <app-todo [todo]="todo"></app-todo>
            }
        </ul>
    `,
    styles: `

      .error, .ng-invalid {
        color: red;
      }

      .todos-container {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        border: 1px solid black;
        padding: 10px;
        width: max-content;
      }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodosComponent {
    todoService = inject(TodosService);
    todos = this.todoService.todos;
    form = new FormGroup({
        todoTitle: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(5)]}),
    });

    onSubmit() {
      this.form.controls.todoTitle.markAsTouched()
      this.form.controls.todoTitle.markAsDirty()
        if (this.form.valid) {
            this.todoService.addTodo({
                id: Date.now(),
                title: this.form.controls.todoTitle.value,
                completed: false,
                userId: 1
            })
            this.form.reset();
        }
    }
}
