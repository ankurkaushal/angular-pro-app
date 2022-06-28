import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  BehaviorSubject,
  map,
  Observable,
  tap,
  switchMap,
  from,
  Subject,
  withLatestFrom,
  of,
} from 'rxjs';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Store } from '../../../../store';
import { Meal } from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';

@Injectable()
export class ScheduleService {
  private date$ = new BehaviorSubject(new Date());
  private section$ = new Subject();
  private list$ = new Subject();
  private itemList$ = new Subject();

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private auth: AuthService
  ) {}

  setDate(): Observable<any> {
    return this.date$.pipe(
      tap((next) => this.store.set('date', next)),
      map((day: any) => {
        const startAt = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        ).getTime();

        const endAt =
          new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate() + 1
          ).getTime() - 1;

        return { startAt, endAt };
      }),
      switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
      map((data: any) => {
        const mapped: ScheduleList = {};

        for (const prop of data) {
          if (!mapped[prop.section]) {
            mapped[prop.section] = prop;
          }
        }

        return mapped;
      }),
      tap((next: any) => {
        this.store.set('schedule', next)
      })
    );
  }

  private getSchedule(startAt: number, endAt: number): any {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db
          .list(`schedule/${user?.uid}`, (ref) =>
            ref.orderByChild('timestamp').startAt(startAt).endAt(endAt)
          )
          .snapshotChanges();
      }),
      map((changes: any[]) => {
        return changes.map((c) => {
          return { $key: c.payload.key, ...c.payload.val() };
        });
      }),
    );
  }

  updateDate(date: Date) {
    this.date$.next(date);
  }

  onSectionChange(): Observable<any> {
    return this.section$.pipe(
      tap((next) => {
        this.store.set('selected', next);
      })
    );
  }

  subscribeToList(): Observable<any> {
    return this.section$.pipe(
      map((value: any) => this.store.value[value.type]),
      tap((next) => {
        this.store.set('list', next);
      })
    );
  }

  selectSection(event: any): void {
    this.section$.next(event);
  }

  itemsListSubscribe() {
    return this.itemList$.pipe(
      withLatestFrom(this.section$),
      switchMap(([items, section]: any[]) => {
        const id = section.data.$key;
        const defaults: ScheduleItem = {
          workouts: null,
          meals: null,
          section: section.section,
          timestamp: new Date(section.day).getTime(),
        };

        const payload = {
          ...(id ? section.data : defaults),
          ...items,
        };

        if (id) {
          return this.updateSection(id, payload);
        } else {
          return this.createSection(payload);
        }
      })
    );
  }

  private updateSection(key: string, payload: ScheduleItem): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        delete payload.$key;

        return this.db.object(`schedule/${user?.uid}/${key}`).update(payload);
      })
    );
  }

  private createSection(payload: ScheduleItem): Observable<any> {
    return from(this.auth.user).pipe(
      switchMap((user) => {
        return this.db.list(`schedule/${user?.uid}`).push(payload);
      })
    );
  }

  updateItems(items: string[]) {
    this.itemList$.next(items);
  }
}

export interface ScheduleItem {
  meals: Meal[] | null;
  workouts: Workout[] | null;
  section: string;
  timestamp: number;
  $key?: string;
}

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snacks?: ScheduleItem;
  [key: string]: any;
}
