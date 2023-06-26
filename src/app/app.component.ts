import { Component } from '@angular/core';
import { CalendarEvent } from '../types/types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'Calendar';
  owner = '@ Martin Bruland, 2023';
  
  
  events: CalendarEvent[] = [
    {
      title: "Event 1",
      description: "Example event",
      tag: "Todos",
      startDate: "",
      endDate: "",
      status: false,
    },
    {
      title: "Event 2",
      description: "Example event",
      tag: "Work",
      startDate: "",
      endDate: "",
      status: false,
    },
    {
      title: "Event 3",
      description: "Example event",
      tag: "Personal",
      startDate: "",
      endDate: "",
      status: true,
    }
  ];

  createEvent = (obj: CalendarEvent) => {

  };
  readEvents = () => {

  };
  updateEvent = (id: string, obj: CalendarEvent) => {

  };
  deleteEvent = (id: string) => {

  };
  filterEvents = (val: string) => {

  };

  
  todaysDate = '';
  selectedDate = '';

  selectDate = () => {

  };
  selectMonth = () => {

  };
  selectYear = () => {

  };

}
