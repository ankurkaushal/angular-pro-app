import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'schedule-controls',
  styleUrls: ['schedule-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="controls">
      <button type="button">
        <img src="/assets/img/chevron-left.svg" alt="" (click)="moveDate(offset - 1)" />
      </button>
      <p>{{selected | date:'MMMM d, y'}}</p>
      <button type="button">
        <img src="/assets/img/chevron-right.svg" alt="" (click)="moveDate(offset + 1)"/>
      </button>
    </div>
  `,
})
export class ScheduleControlsComponent {
  offset = 0;

  @Input()
  selected: Date | null;

  @Output()
  move = new EventEmitter<number>()

  constructor() {}

  moveDate(offset: number) {
    this.offset = offset;
    this.move.emit(offset);
  }
}
