import { Component } from '@angular/core';
import { CalendarEvent } from '../../types/types'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  // Input: Selected Tag
  // Input: Selected Date

  events: CalendarEvent[] = [
    {
      id: "1",
      title: "Event 1",
      description: "Example event",
      tag: "Todos",
      startDate: "",
      endDate: "",
      status: false,
    },
    {
      id: "2",
      title: "Event 2",
      description: "Example event",
      tag: "Work",
      startDate: "",
      endDate: "",
      status: false,
    },
    {
      id: "3",
      title: "Event 3",
      description: "Example event",
      tag: "Personal",
      startDate: "",
      endDate: "",
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
        this.selectedItem.startDate = value;
        return;
      case "endDate":
        this.selectedItem.endDate = value;
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
      startDate: "",
      endDate: "",
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
    return this.events.filter(item => item.startDate === val);
  };

  filterItemsByStatus = (val: boolean) => {
    return this.events.filter(item => item.status === val);
  };

}
