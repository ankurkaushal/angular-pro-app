import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '../../../../store';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meals',
  styleUrls: ['meals.component.scss'],
  template: `
    <div class="meals">
      <div class="meals__title">
        <h1>
          <img src="/assets/img/food.svg" alt="" />
          Your meals
        </h1>
        <a class="btn__add" routerLink="../meals/new">
          <img src="/assets/img/add-white.svg" alt="" />
          New Meal
        </a>
      </div>
      <div *ngIf="meals$ | async as meals; else loading">
        <div class="message" *ngIf="!meals.length">
          <img src="/assets/img/face.svg" alt="" />
          No meals, add a new meal to start.
        </div>
        <list-item
          *ngFor="let meal of meals"
          [item]="meal"
          (remove)="removeMeal($event)"
        ></list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/assets/img/loading.svg" alt="" />
          ...fetching meals
        </div>
      </ng-template>
    </div>
  `,
})
export class MealsComponent implements OnInit, OnDestroy {
  constructor(private mealsService: MealsService, private store: Store) {}

  meals$: Observable<Meal[]>;
  subscription: Subscription;

  ngOnInit(): void {
    this.meals$ = this.store.select<Meal[]>('meals');
    this.subscription = this.mealsService.getMeals().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeMeal(meal: Meal): void {
    this.mealsService.removeMeal(meal?.$key).subscribe();
  }
}
