import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'schedule-days',
  styleUrls: ['schedule-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="days">
      <button type="button" class="day" *ngFor="let day of days; index as i" (click)="onSelectDay(i)">
        <span [class.active]="i === selected">{{day}}</span>
      </button>
    </div>
  `
})
export class ScheduleDaysComponent {
  days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @Input()
  selected: number;

  @Output()
  selectDay = new EventEmitter<number>();

  constructor() {}

  onSelectDay(index: number) {
    this.selectDay.emit(index);
  }
}
