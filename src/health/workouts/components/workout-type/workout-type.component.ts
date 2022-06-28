import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const TYPE_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WorkoutTypeComponent),
  multi: true,
};

@Component({
  selector: 'workout-type',
  providers: [TYPE_CONTROL_ACCESSOR],
  styleUrls: ['workout-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workout-type">
      <div class="workout-type__pane" *ngFor="let selector of selectors" [class.active]= "selector === value" (click)="setSelected(selector)">
        <img src="/assets/img/{{ selector }}.svg" alt="" />
        <p>{{ selector }}</p>
      </div>
    </div>
  `,
})
export class WorkoutTypeComponent implements ControlValueAccessor {
  selectors = ['strength', 'endurance'];

  constructor() {}

  value: string;

  private onTouch: Function;
  private onModelChange: Function;

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  writeValue(value: string): void {
    this.value = value;
  }

  setSelected(value: string) {
    this.value = value;
    this.onModelChange(value);
    this.onTouch();
  }
}
