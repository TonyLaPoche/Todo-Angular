import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {JsonPipe} from "@angular/common";
import {TodosService} from "./todos.service";
import {TodoComponent} from "./todo/todo.component";
import {Todo} from './todos.model';

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [
        TodoComponent,
        ReactiveFormsModule,
        DragDropModule,
        JsonPipe
    ],
    template: `
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
            <input type="text" formControlName="todoTitle"/>
            <button type="submit">Add</button>
        </form>
        <section class="sort-container">
            <button (click)="sortTodos('priority')">Sort by: Priority</button>
            <button (click)="sortTodos('completed')">Sort by: Done</button>
            <button (click)="sortTodos('id')">Sort by: Todo</button>
        </section>
        @if (form.controls.todoTitle.errors; as error) {
            @if (error['required'] && form.controls.todoTitle.dirty && form.controls.todoTitle.touched) {
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
        <ul class="todos-container" cdkDropList (cdkDropListDropped)="drop($event)">
            @for (todo of todos(); track todo.id) {
                <app-todo [todo]="todo" cdkDrag></app-todo>
            }
        </ul>
    `,
    styles: `
      .sort-container {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: .5rem 0;
      }

      .form-container {
        display: flex;
        justify-content: center;
      }

      .error, .ng-invalid {
        color: red;
      }

      .error {
        text-align: center;
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
                userId: 1,
                priority: this.todos().length + 1
            })
            this.form.reset();
        }
    }

    sortTodos(key: keyof Todo) {
        this.todoService.sortby(key)
    }

    drop(event: CdkDragDrop<Todo[]>) {
        moveItemInArray(this.todos(), event.previousIndex, event.currentIndex);
        this.todos().forEach((todo, index) => {
            this.todoService.updateTodo(todo.id, {priority: index + 1});
        });
    }
}
