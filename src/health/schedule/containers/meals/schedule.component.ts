import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '../../../../store';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';
import {
  ScheduleItem,
  ScheduleService,
} from '../../../shared/services/schedule/schedule.service';
import {
  Workout,
  WorkoutsService,
} from '../../../shared/services/workouts/workouts.service';

@Component({
  selector: 'schedule',
  styleUrls: ['schedule.component.scss'],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="date$ | async"
        [items]="schedule$ | async"
        (changeDate)="changeDate($event)"
        (sectionChanged)="changeSection($event)"
      ></schedule-calendar>
      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="list$ | async"
        (update)="assignItem($event)"
        (cancel)="closeAssign()"
      ></schedule-assign>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  date$: Observable<Date>;
  schedule$: Observable<ScheduleItem>;
  selected$: Observable<any>;
  list$: Observable<Meal[] | Workout[]>;
  subscriptions: Subscription[] = [];
  open = false;

  constructor(
    private scheduleService: ScheduleService,
    private store: Store,
    private mealService: MealsService,
    private workoutService: WorkoutsService
  ) {}

  ngOnInit(): void {
    this.date$ = this.store.select('date');
    this.schedule$ = this.store.select('schedule');
    this.selected$ = this.store.select('selected');
    this.list$ = this.store.select('list');

    this.subscriptions = [
      this.scheduleService.setDate().subscribe(),
      this.scheduleService.onSectionChange().subscribe(),
      this.mealService.getMeals().subscribe(),
      this.workoutService.getWorkouts().subscribe(),
      this.scheduleService.subscribeToList().subscribe(),
      this.scheduleService.itemsListSubscribe().subscribe()
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  closeAssign() {
    this.open = false;
  }

  assignItem(items: string[]) {
    this.scheduleService.updateItems(items);
    this.closeAssign()
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }

  changeSection(event: any) {
    this.open = true;
    this.scheduleService.selectSection(event);
  }
}
