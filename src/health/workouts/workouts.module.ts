import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { WorkoutComponent } from './containers/workout/workout.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';
import { WorkoutsComponent } from './containers/workouts/workouts.component';
import { WorkoutTypeComponent } from './components/workout-type/workout-type.component';

export const ROUTES: Routes = [
  { path: '', component: WorkoutsComponent },
  { path: 'new', component: WorkoutComponent },
  { path: ':id', component: WorkoutComponent },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
  ],
  declarations: [WorkoutsComponent, WorkoutComponent, WorkoutFormComponent, WorkoutTypeComponent],
  providers: [],
})
export class WorkoutsModule {}
