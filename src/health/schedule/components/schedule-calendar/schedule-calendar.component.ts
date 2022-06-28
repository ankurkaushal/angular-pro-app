import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ScheduleItem,
  ScheduleList,
} from '../../../shared/services/schedule/schedule.service';

@Component({
  selector: 'schedule-calendar',
  styleUrls: ['schedule-calendar.component.scss'],
  template: `
    <div class="calendar">
      <schedule-controls
        [selected]="selectedDay"
        (move)="onChange($event)"
      ></schedule-controls>
      <schedule-days
        [selected]="selectedDayIndex"
        (selectDay)="selectDay($event)"
      ></schedule-days>
      <schedule-section
        *ngFor="let section of sections"
        [name]="section.name"
        [section]="getSection(section.name)"
        (selected)="selectSection($event, section.key)"
      >
      </schedule-section>
    </div>
  `,
})
export class ScheduleCalendarComponent implements OnChanges {
  selectedDay: Date | null;
  selectedDayIndex: number;
  selectedWeek: Date;
  sections = [
    { key: 'morning', name: 'Morning' },
    { key: 'lunch', name: 'Lunch' },
    { key: 'evening', name: 'Evening' },
    { key: 'snacks', name: 'Snacks and Drinks' },
  ];

  @Output()
  changeDate = new EventEmitter<Date>();

  @Output()
  sectionChanged = new EventEmitter<any>();

  @Input()
  set date(date: Date | null) {
    if (date) {
      this.selectedDay = new Date(date.getTime());
    }
  }

  @Input()
  items: ScheduleList | null;

  constructor() {}

  ngOnChanges(): void {
    this.selectedDayIndex = this.getToday(this.selectedDay);
    // @ts-ignore
    this.selectedWeek = this.getStartOfWeek(new Date(this.selectedDay));
  }

  getSection(name: string): ScheduleItem {
    return this.items?.[name.toLocaleLowerCase()] || {};
  }

  private getToday(date: Date | null): number {
    // @ts-ignore
    let today = date.getDay() - 1;

    if (today) {
      today = 6;
    }

    return today;
  }

  onChange(weekOffset: number) {
    const startOfWeek = this.getStartOfWeek(new Date());
    const startDate = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate()
    );
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    this.changeDate.emit(startDate);
  }

  private getStartOfWeek(date: Date): Date {
    const day = date?.getDay();
    const diff = date?.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date?.setDate(diff));
  }

  selectDay(index: number) {
    const selectedDate = new Date(this.selectedWeek);
    selectedDate.setDate(selectedDate.getDate() + index);

    this.changeDate.emit(selectedDate);
  }

  selectSection({type, assigned, data}: any, section: string) {
    const day = this.selectedDay;

    this.sectionChanged.emit({
      type,
      assigned,
      section,
      day,
      data
    });
  }
}
