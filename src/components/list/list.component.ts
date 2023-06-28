import { Component } from '@angular/core';
import { CalendarEvent } from '../../types/types'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  // Input: Selected Tag
  selectedTag = "Work";

  // Input: Selected Date
  selectedDate = new Date();
  day = this.selectedDate.getDate();
  month = this.selectedDate.getMonth();
  year = this.selectedDate.getFullYear();


  events: CalendarEvent[] = [
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
  ];

  selectedItem: CalendarEvent | undefined = undefined;

  editMode = false;




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
    this.events[index].status = value;
  };

  onSaveHandler = (obj: CalendarEvent) => {
    const index = this.events.findIndex((item => item.id === obj.id));
    this.events[index] = obj;
    this.setEditMode();
  };


  createHandler = (event: Event) => {
    const val = (event.target as HTMLInputElement).value;
    const obj: CalendarEvent = {
      id: String(Math.floor(Math.random() * 999999)),
      title: val,
      description: "",
      tag: "",
      status: false,
    }
    this.events.push(obj);
  };

  readItems = () => {
    return this.events;
  };

  deleteHandler = (id: string) => {
    this.events = this.events.filter(item => item.id !== id);
  };

  filterItemsByTag = (val: string) => {
    return this.events.filter(item => item.tag === val);
  };

  filterItemsByDate = (val: string) => {
    return this.events.filter(item => item.startDate === new Date(val));
  };

  filterItemsByStatus = (val: boolean) => {
    return this.events.filter(item => item.status === val);
  };

}
