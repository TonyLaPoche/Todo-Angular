import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export type Todos = Todo[]

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private urlApi = "https://jsonplaceholder.typicode.com/todos"
  private http = inject(HttpClient);

  todos$ = this.http.get<Todos>(this.urlApi)

}
