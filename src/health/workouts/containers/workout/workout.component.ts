import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import {
  Workout,
  WorkoutsService,
} from '../../../shared/services/workouts/workouts.service';

@Component({
  selector: 'workout',
  styleUrls: ['workout.component.scss'],
  template: `
    <div class="workout">
      <div class="workout__title">
        <h1>
          <img src="/assets/img/food.svg" alt="" />
          <span *ngIf="workout$ | async as workout; else title">
            {{ workout?.name ? 'Edit' : 'Create' }} Workout
          </span>
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="workout$ | async as workout; else loading">
        <workout-form
          [workout]="workout"
          (create)="addWorkout($event)"
          (update)="updateWorkout($event)"
          (remove)="removeWorkout($event)"
        ></workout-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/src/loading.svg" alt="" />
          Fetching workout...
        </div>
      </ng-template>
    </div>
  `,
})
export class WorkoutComponent implements OnInit, OnDestroy {
  workout$: Observable<Workout>;
  subscription: Subscription;

  constructor(
    private workoutService: WorkoutsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.workoutService.getWorkouts().subscribe();

    this.workout$ = this.route.params.pipe(
      switchMap((param: any) => {
        return this.workoutService.getWorkout(param?.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addWorkout(workout: Workout) {
    this.workoutService.addWorkout(workout).subscribe();
    this.backToWorkouts();
  }

  updateWorkout(workout: Workout) {
    const key = this.route.snapshot.params['id'];

    this.workoutService.updateWorkout(key, workout).subscribe();
    this.backToWorkouts();
  }

  removeWorkout(workout: Workout) {
    const key = this.route.snapshot.params['id'];

    this.workoutService.removeWorkout(key).subscribe();
    this.backToWorkouts();
  }

  backToWorkouts() {
    this.router.navigate(['workouts']);
  }
}
