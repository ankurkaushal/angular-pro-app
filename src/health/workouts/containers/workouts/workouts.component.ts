import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '../../../../store';
import {
  Workout,
  WorkoutsService,
} from '../../../shared/services/workouts/workouts.service';

@Component({
  selector: 'workouts',
  styleUrls: ['workouts.component.scss'],
  template: `
    <div class="workouts">
      <div class="workouts__title">
        <h1>
          <img src="/assets/img/workout.svg" alt="" />
          Your workouts
        </h1>
        <a class="btn__add" routerLink="../workouts/new">
          <img src="/assets/img/add-white.svg" alt="" />
          New Workout
        </a>
      </div>
      <div *ngIf="workouts$ | async as workouts; else loading">
        <div class="message" *ngIf="!workouts.length">
          <img src="/assets/img/face.svg" alt="" />
          No workouts, add a new workout to start.
        </div>
        <list-item
          *ngFor="let workout of workouts"
          [item]="workout"
          (remove)="removeWorkout($event)"
        ></list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="" />
          ...fetching workouts
        </div>
      </ng-template>
    </div>
  `,
})
export class WorkoutsComponent implements OnInit, OnDestroy {
  constructor(private workoutsService: WorkoutsService, private store: Store) {}

  workouts$: Observable<Workout[]>;
  subscription: Subscription;

  ngOnInit(): void {
    this.workouts$ = this.store.select<Workout[]>('workouts');
    this.subscription = this.workoutsService.getWorkouts().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeWorkout(workout: Workout): void {
    this.workoutsService.removeWorkout(workout?.$key).subscribe();
  }
}
