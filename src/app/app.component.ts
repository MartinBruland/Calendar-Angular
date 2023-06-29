import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarEvent } from 'src/types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'Calendar';

  owner = '@ Martin Bruland, 2023';

  selectedDate: Date | undefined = undefined;

  selectedTag: string | undefined = undefined;

  events: CalendarEvent[] = [];
  
  constructor(private cdr: ChangeDetectorRef) {}

  receiveSelectedDate(date: Date) {
    this.selectedDate = date;
  };

  receiveSelectedTag(tag: string) {
    this.selectedTag = tag;
  };

  receiveCalendarEvents(events: CalendarEvent[]) {
    this.events = events;
    this.cdr.detectChanges();
  };
  
}