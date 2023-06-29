import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../types/types'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnChanges, OnInit {

  @Input() inputDate: Date | undefined;
  @Input() inputTag: string | undefined;
  @Output() outputEvents: EventEmitter<CalendarEvent[]> = new EventEmitter<CalendarEvent[]>();

  outputEmitHandler = (events: CalendarEvent[]) => {
    this.outputEvents.emit(events);
  };

  events: CalendarEvent[] = [];

  selectedItem: CalendarEvent | undefined = undefined;

  editMode = false;

  ngOnInit(): void {
    this.events = this.reloadCalendarEvents()
    this.outputEmitHandler(this.events);
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.outputEmitHandler(this.events);
  };

  setEditMode = () => {
    this.editMode = !this.editMode;
  };

  onSelectHandler = (id: string) => {
    const found = this.events.find(item => item.id === id);
    if (found) {
      this.selectedItem = found;
      this.editMode = true;
    };
  };

  onChangeHandler = (event: KeyboardEvent) => {
    if (!this.selectedItem) return;
    const key = (event.target as HTMLInputElement).id;
    const value = (event.target as HTMLInputElement).value;
    switch (key) {
      case "title":
        this.selectedItem.title = value;
        return;
      case "description":
        this.selectedItem.description = value;
        return;
      case "tag":
        this.selectedItem.tag = value;
        return;
      case "startDate":
        return;
      case "endDate":
        return;
      case "status":
        this.selectedItem.status = value === "true" ? true : false;
        return;
    };
  };

  onCheckedHandler = (event: Event) => {
    const key = (event.target as HTMLInputElement).id;
    const value = (event.target as HTMLInputElement).checked;
    const index = this.events.findIndex((item => item.id === key));
    const updatedEvents = [...this.events];
    updatedEvents[index].status = value;
    this.events = updatedEvents;
  };

  onSaveHandler = (obj: CalendarEvent) => {
    const updatedEvents = [...this.events];
    const index = updatedEvents.findIndex((item => item.id === obj.id));
    updatedEvents[index] = obj;
    this.events = updatedEvents;
    this.outputEmitHandler(updatedEvents);
    this.setEditMode();
  };

  createHandler = (event: Event) => {
    const val = (event.target as HTMLInputElement).value;

    const selectedDate = this.inputDate ? this.inputDate : new Date();

    const obj: CalendarEvent = {
      id: String(Math.floor(Math.random() * 999999)),
      title: val,
      description: "",
      tag: "Work",
      startDate: selectedDate,
      status: false,
    }
    const updatedEvents = [...this.events];
    updatedEvents.push(obj);
    this.events = updatedEvents;
    this.outputEmitHandler(updatedEvents);
  };

  readItems = () => {

    const originalEvents: CalendarEvent[] = this.events;

    let filteredEvents: CalendarEvent[] = [];

    filteredEvents = originalEvents;

    if (this.inputTag === "All") {
      filteredEvents = originalEvents;
    };
    
    if (this.inputTag === "Completed") {
      filteredEvents = this.filterItemsByStatus(true, originalEvents);
    };
    
    if (this.inputTag && this.inputTag !== "All" && this.inputTag !== "Completed") {
      filteredEvents = this.filterItemsByTag(this.inputTag, originalEvents);
    };

    if (this.inputTag && this.inputDate) {
      filteredEvents = this.filterItemsByDate(this.inputDate, filteredEvents);
    };

    if (!this.inputTag && this.inputDate) {
      filteredEvents = this.filterItemsByDate(this.inputDate, originalEvents);
    };

    return filteredEvents;
  };

  deleteHandler = (id: string) => {
    const updatedEvents = [...this.events].filter(item => item.id !== id);
    this.events = updatedEvents;
    this.outputEmitHandler(updatedEvents);
    this.setEditMode();
  };

  filterItemsByTag = (val: string, data: CalendarEvent[]) => {
    return [...data].filter(item => item.tag === val);
  };

  filterItemsByDate = (val: Date, data: CalendarEvent[]) => {
    return [...data].filter(item => 
      item.startDate?.getDate() === val.getDate() &&
      item.startDate.getMonth() === val.getMonth() && 
      item.startDate.getFullYear() === val.getFullYear()
    );
  };

  filterItemsByStatus = (val: boolean, data: CalendarEvent[]) => {
    return [...data].filter(item => item.status === val);
  };



  reloadCalendarEvents = () => {
    return [
      {
        id: "1",
        title: "Event 1",
        description: "Example event",
        tag: "Todos",
        startDate: new Date("6/1/23"),
        endDate: new Date("6/7/23"),
        status: false,
      },
      {
        id: "2",
        title: "Event 2",
        description: "Example event",
        tag: "Work",
        startDate: new Date("6/1/23"),
        endDate: new Date("6/7/23"),
        status: false,
      },
      {
        id: "3",
        title: "Event 3",
        description: "Example event",
        tag: "Personal",
        startDate: new Date("6/1/23"),
        endDate: new Date("6/7/23"),
        status: true,
      }
    ] as CalendarEvent[]
  };

}
