import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {Todo} from "../todos.model";
import {TodosService} from "../todos.service";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe} from "@angular/common";
import {CdkDrag, CdkDragHandle} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-todo',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        JsonPipe,
        CdkDragHandle,
        CdkDrag
    ],
    template: `
        <li class="item" cdkDrag>
            <div class="config">
              <span class="material-symbols-outlined draggable" cdkDragHandle>
                drag_handle
              </span>
                {{ todo().priority }}
                <input type="checkbox" [checked]="todo().completed" (click)="toggleCompleted(todo())">
            </div>
            @if (isEditable()) {
                <span [class.done]="todo().completed">
                    {{ todo().title }}
                </span>
            } @else {
                <input type="text" [formControl]="titleCtrl" (blur)="onEdit()">
            }
            <div class="config">
                <button class="material-symbols-outlined" (click)="deleteTodo(todo().id)">
                    delete
                </button>
                <button class="material-symbols-outlined" (click)="onEdit()">
                    edit
                </button>
            </div>
        </li>
        @if (!isEditable() && titleCtrl.errors; as error) {
            @if (error['required'] && titleCtrl.dirty || titleCtrl.touched) {
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

      .draggable {
        cursor: grab;
      }

      .item {
        list-style: none;
        padding: 5px;
        border: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
      }

      .config {
        display: flex;
        align-items: center;
        gap: 5px;
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
    private todoService = inject(TodosService);
    isEditable = signal(true);
    titleCtrl = new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(5)]});

    onEdit() {
        this.isEditable.update((modify) => !modify)
        if (!this.isEditable()) {
            this.titleCtrl.patchValue(this.todo().title)
        }
        if (this.todo().title != this.titleCtrl.value) {
            if (this.titleCtrl.valid) {
                this.todoService.updateTodo(this.todo().id, {title: this.titleCtrl.value})
            }
        }
    }

    toggleCompleted(todo: Todo) {
        this.todoService.updateTodo(this.todo().id, {completed: !todo.completed})
    }

    deleteTodo(id: number) {
        this.todoService.deleteTodo(id)
    }
}
