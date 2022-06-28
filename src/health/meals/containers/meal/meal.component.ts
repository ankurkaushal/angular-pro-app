import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, switchMap } from 'rxjs';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meal',
  styleUrls: ['meal.component.scss'],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="/assets/img/food.svg" alt="" />
          <span *ngIf="meal$ | async as meal; else title">
            {{ meal?.name ? 'Edit' : 'Create' }} Meal
          </span>
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="meal$ | async as meal; else loading">
        <meal-form
          [meal]="meal"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (remove)="removeMeal($event)"
        ></meal-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/src/loading.svg" alt="" />
          Fetching meal...
        </div>
      </ng-template>
    </div>
  `,
})
export class MealComponent implements OnInit, OnDestroy {
  meal$: Observable<Meal>;
  subscription: Subscription;

  constructor(
    private mealService: MealsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.mealService.getMeals().subscribe();

    this.meal$ = this.route.params.pipe(
      switchMap((param: any) => {
        return this.mealService.getMeal(param?.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  addMeal(meal: Meal) {
    this.mealService.addMeal(meal).subscribe();
    this.backToMeals();
  }

  updateMeal(meal: Meal) {
    const key = this.route.snapshot.params['id'];

    this.mealService.updateMeal(key, meal).subscribe();
    this.backToMeals();
  }

  removeMeal(meal: Meal) {
    const key = this.route.snapshot.params['id'];

    this.mealService.removeMeal(key).subscribe();
    this.backToMeals();
  }

  backToMeals() {
    this.router.navigate(['meals']);
  }
}
