import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarEvent } from 'src/types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  darkmode = false;

  labelTitle = 'Calendar';
  labelCopyright = '@ Martin Bruland, 2023';
  labelDarkMode = this.darkmode ? "Light" : "Dark";


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

  setDarkMode = () => {
    this.darkmode = !this.darkmode;
    this.labelDarkMode = this.darkmode ? "Light" : "Dark";
  };
  
}