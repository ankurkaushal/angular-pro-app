/* eslint-disable no-undefined */
import { BehaviorSubject, distinctUntilChanged, Observable, pluck, scheduled } from 'rxjs';
import { User } from './auth/shared/services/auth/auth.service';
import { Meal } from './health/shared/services/meals/meals.service';
import { ScheduleItem } from './health/shared/services/schedule/schedule.service';
import { Workout } from './health/shared/services/workouts/workouts.service';

export interface State {
  user?: User | undefined;
  meals?: Meal[];
  workouts?: Workout[];
  selected?: any;
  list?: any;
  date?: Date;
  schedule?: ScheduleItem[];
  [key: string]: any;
}

const state: State = {
  user: undefined,
  meals: undefined,
  date: undefined,
  schedule: undefined,
  selected: undefined,
  list: undefined
};

export class Store {
  private subject = new BehaviorSubject<State>(state);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: string): Observable<T> {
    return this.store.pipe(pluck(name));
  }

  set(name: string, state: any) {
    this.subject.next({ ...this.value, [name]: state });
  }
}
