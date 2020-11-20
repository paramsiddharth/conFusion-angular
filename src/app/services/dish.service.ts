import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map } from 'rxjs/operators';
import { features } from 'process';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    console.log(`${baseURL}/dishes`);
    return this.http.get<Dish[]>(`${baseURL}/dishes`);
  }

  getDish(id: string): Observable<Dish> {
    return this.http.get<Dish>(`${baseURL}/dishes/${id}`);
  }

  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish[]>(`${baseURL}/dishes`, {
      params: {
        featured: "true"
      }
    })
      .pipe(map(dishes => dishes[0]));
  }

  getDishIds(): Observable<string[] | any> {
    return this.getDishes()
      .pipe(map(dishes => dishes.map(dish => dish.id)));
  }
}
