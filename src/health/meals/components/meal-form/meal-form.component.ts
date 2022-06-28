import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Meal } from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['meal-form.component.scss'],
  template: `
    <div class="meal-form">
      <form [formGroup]="form">
        <div class="meal-form__name">
          <label for="">
            <h3>Meal Name</h3>
            <input
              type="text"
              placeholder="e.g english breakfast"
              formControlName="name"
            />
            <div class="error" *ngIf="required">Meal name is required</div>
          </label>
        </div>

        <div class="meal-form__food">
          <div class="meal-form__subtitle">
            <h3>Food</h3>
            <button
              type="button"
              class="meal-form__add"
              (click)="addIngredient()"
            >
              <img src="/assets/img/add-white.svg" alt="" />
              Add Food
            </button>
          </div>
          <div formArrayName="ingredients">
            <label *ngFor="let c of ingredients.controls; index as i">
              <input type="text" [formControlName]="i" placeholder="e.g eggs" />
              <span
                class="meal-form__remove"
                (click)="removeIngredient(i)"
              ></span>
            </label>
          </div>
        </div>

        <div class="meal-form__submit">
          <div>
            <button *ngIf="!exists" type="button" class="button" (click)="createMeal()">
              Create Meal
            </button>
            <button *ngIf="exists" type="button" class="button" (click)="updateMeal()">
              Save
            </button>
            <a href="" class="button button--cancel" routerLink="../"> Cancel </a>
          </div>

          <div class="meal-form__delete" *ngIf="exists">
            <div *ngIf="toggled">
              <p>Delete item?</p>
              <button class="confirm" type="button" (click)="removeMeal()">
                Yes
              </button>
              <button class="cancel" type="button" (click)="toggle()">
                No
              </button>
            </div>

            <button
              class="button button--delete"
              type="button"
              (click)="toggle()"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class MealFormComponent implements OnChanges {
  toggled = false;
  exists = false;

  @Output()
  create = new EventEmitter<any>();

  @Output()
  update = new EventEmitter<any>();

  @Output()
  remove = new EventEmitter<any>();

  @Input()
  meal: Meal;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.meal?.name) {
      this.exists = true;
      this.emptyIngredients();

      const value = this.meal;
      this.form.patchValue(value);

      if (value?.ingredients) {
        for (const item of value.ingredients) {
          this.ingredients.push(new FormControl(item));
        }
      }
    }
  }
  emptyIngredients() {
    while (this.ingredients?.controls?.length) {
      this.ingredients.removeAt(0);
    }
  }

  form = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array(['']),
  });

  get required() {
    return (
      this.form.get('name')?.hasError('required') &&
      this.form.get('name')?.touched
    );
  }

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(new FormControl(''));
  }

  createMeal() {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

  updateMeal() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  removeIngredient(i: number) {
    this.ingredients.removeAt(i);
  }

  removeMeal() {
    this.remove.emit(this.form.value);
  }

  toggle() {
    this.toggled = !this.toggled;
  }
}
