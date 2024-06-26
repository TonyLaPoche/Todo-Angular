import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {Todo} from "../todos.model";
import {TodosService} from "../todos.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  template: `
      <li class="item">
          <input type="checkbox" [checked]="todo().completed" (click)="setTodo(!todo().completed)">
          @if (onModify()) {
              <span [class.done]="todo().completed">
          {{ todo().title }}
          </span>
          } @else {
              <input type="text" [formControl]="editTitle" (focusout)="hasEdit()">
          }
          <div class="config">
              <button class="material-symbols-outlined" (click)="todoService.deleteTodo(todo().id)">
                  delete
              </button>
              <button class="material-symbols-outlined" (click)="hasEdit()">
                  edit
              </button>
          </div>
      </li>
      @if (!onModify() && editTitle.errors; as error) {
        @if (error['required'] && editTitle.dirty && editTitle.touched ) {
          <p class="error">
            Need some value to modify this !
          </p>
        } 
        @if (error['minlength']; as minLengthErr) {
          <p class="error">
            {{ minLengthErr['actualLength'] }} /
            {{ minLengthErr['requiredLength'] }} Minimum length required
          </p>
        }
      }
  `,
  styles: `
    .item {
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 400px;
    }

    .config {
      display: flex;
      gap: 10px;
    }

    .done {
      text-decoration: line-through;
    }

    .error, .ng-invalid {
      color: red;
    }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoComponent {
  todo = input.required<Todo>();
  todoService = inject(TodosService);
  onModify = signal(true);
  editTitle = new FormControl('', {nonNullable : true, validators: [Validators.required, Validators.minLength(5)]});

  hasEdit() {
    this.onModify.update((modify) => !modify)
    if (!this.onModify()) {
      this.editTitle.patchValue(this.todo().title)
    }
    if (this.todo().title != this.editTitle.value) {
      if (this.editTitle.valid) {
        this.todoService.updateTodo(this.todo().id, {title: this.editTitle.value})
      }
    }
  }
  setTodo(value: boolean) {
    this.todoService.updateTodo(this.todo().id, {completed: value})
  }
}
