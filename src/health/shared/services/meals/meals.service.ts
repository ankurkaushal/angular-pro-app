import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { Store } from 'store';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Meal {
  name: string;
  ingredients: string[];
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class MealsService {
  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {}

  getMeals(): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`meals/${user?.uid}`).snapshotChanges();
      }),
      map((changes: any[]) => {
        return changes.map((c) => {
          return { $key: c.payload.key, ...c.payload.val() };
        });
      }),
      tap((meals) => {
        this.store.set('meals', meals);
      })
    );
  }

  getMeal(key: string): Observable<any> {
    if (!key) {
      return of({});
    }

    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map((meals: Meal[]) => {
        return meals.find((meal: Meal) => meal.$key === key)
      })
    )
  }

  addMeal(meal: Meal): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`meals/${user?.uid}`).push(meal);
      })
    );
  }

  updateMeal(key: string, meal: Meal): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.object(`meals/${user?.uid}/${key}`).update(meal);
      })
    );
  }

  removeMeal(key: string) {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`meals/${user?.uid}`).remove(key);
      })
    );
  }
}
