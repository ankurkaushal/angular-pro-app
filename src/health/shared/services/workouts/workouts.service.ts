import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { filter, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { Store } from 'store';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

export interface Workout {
  name: string;
  type: string;
  strength: any;
  endurance: any;
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class WorkoutsService {
  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {}

  getWorkouts(): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`workouts/${user?.uid}`).snapshotChanges();
      }),
      map((changes: any[]) => {
        return changes.map((c) => {
          return { $key: c.payload.key, ...c.payload.val() };
        });
      }),
      tap((workouts) => {
        this.store.set('workouts', workouts);
      })
    );
  }

  getWorkout(key: string): Observable<any> {
    if (!key) {
      return of({});
    }

    return this.store.select<Workout[]>('workouts').pipe(
      filter(Boolean),
      map((workouts: Workout[]) => {
        return workouts.find((workout: Workout) => workout.$key === key)
      })
    )
  }

  addWorkout(workout: Workout): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`workouts/${user?.uid}`).push(workout);
      })
    );
  }

  updateWorkout(key: string, workout: Workout): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.object(`workouts/${user?.uid}/${key}`).update(workout);
      })
    );
  }

  removeWorkout(key: string) {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`workouts/${user?.uid}`).remove(key);
      })
    );
  }
}
