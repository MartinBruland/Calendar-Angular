import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AuthSession } from '@supabase/supabase-js'
import { SupabaseService } from '../../app/supabase.service'

import { EventValidated } from 'src/types/types'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnChanges, OnInit {

  labelTitle = "Events";
  labelUpdate = "Update Item";
  labelSave = "Save";
  labelDelete = "Delete";
  labelAdd = "+";
  labelName = "Title: ";
  labelDescription = "Description: ";
  labelTag = "Category: ";
  labelStartDate = "Start Date: ";
  labelEndDate = "End Date: ";


  @Input() session!: AuthSession;
  @Input() inputDate: Date | undefined;
  @Input() inputTag: string | undefined;
  @Output() outputEvents: EventEmitter<EventValidated[]> = new EventEmitter<EventValidated[]>();


  events: EventValidated[] = [];

  selectedItem: EventValidated | undefined = undefined;

  isEditViewVisible = false;



  constructor(
    private readonly supabase: SupabaseService, 
  ) {};

  async ngOnInit(): Promise<void> {
    const data = await this.readEvents();
    if (!data) return;
    this.events = data;
    this.outputEmitHandler(data);
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.outputEmitHandler(this.events);
  };

  outputEmitHandler = (events: EventValidated[]) => {
    this.outputEvents.emit(events);
  };



  setEditView = () => {
    this.isEditViewVisible = !this.isEditViewVisible;
  };

  onSelectHandler = (id: string) => {
    const found = this.events.find(item => item.id === id);
    if (found) {
      this.selectedItem = found;
      this.setEditView();
    };
  };

  onChangeHandler = (event: Event) => {
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
        this.selectedItem.date_start = new Date(value);
        return;
      case "endDate":
        this.selectedItem.date_end = new Date(value);
        return;
      case "status":
        this.selectedItem.status = value === "true" ? true : false;
        return;
    };
  };

  onCheckedHandler = async (event: Event) => {

    const key = (event.target as HTMLInputElement).id;
    const value = (event.target as HTMLInputElement).checked;

    const item = this.events.find(item => String(item.id) === String(key));

    if (item) {

      const obj: EventValidated = {
        ...item,
        status: value,
      }

      await this.updateEvent(obj)
      .then( async () => {
        const data = await this.readEvents();
        if (data) {
          this.events = data;
          this.outputEmitHandler(data);
        };
      });

    };

  };

  onSaveHandler = async (obj: EventValidated) => {
    await this.updateEvent(obj)
    .then( async () => {
      const data = await this.readEvents();
      if (data) {
        this.events = data;
        this.outputEmitHandler(data);
        this.setEditView();
      };
    });
  };

  createHandler = async (event: Event) => {

    const val = (event.target as HTMLInputElement).value;

    const selectedDate = this.inputDate ? this.inputDate : new Date();

    const obj: EventValidated = {
      date_created: new Date(),
      title: val,
      tag: "All",
      date_start: selectedDate,
      status: false,
    };

    await this.createEvent(obj)
    .then( async () => {
      const data = await this.readEvents();
      if (data) {
        this.events = data;
        this.outputEmitHandler(data);
        (event.target as HTMLInputElement).value = ""
      };
    });

  };

  deleteHandler = async (id: string) => {

    const obj = this.events.find(item => item.id === id);

    if (!obj) return;

    await this.deleteEvent(obj)
    .then( async () => {
      const data = await this.readEvents();
      if (data) {
        this.events = data;
        this.outputEmitHandler(data);
        this.setEditView();
      };
    });

  };


  getFilteredItems = () => {

    const originalEvents: EventValidated[] = this.events;
    let filteredEvents: EventValidated[] = [];

    if (!this.inputTag || this.inputTag === "All") {
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

  filterItemsByTag = (val: string, data: EventValidated[]) => {
    return [...data].filter(item => item.tag === val);
  };

  filterItemsByDate = (val: Date, data: EventValidated[]) => {
    return [...data].filter(item => 
      item.date_start &&
      item.date_start.getDate() === val.getDate() &&
      item.date_start.getMonth() === val.getMonth() && 
      item.date_start.getFullYear() === val.getFullYear()
    );
  };

  filterItemsByStatus = (val: boolean, data: EventValidated[]) => {
    return [...data].filter(item => item.status === val);
  };

  formatDate = (date: Date | undefined) => {
    if (!date) return;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };






  // CRUD CONTROLLERS:

  createEvent = async (event: EventValidated) => {

    const { user } = this.session

    const convertedEvent = this.supabase.convertToEventRequest(event, user);
    if (!convertedEvent) throw new Error('An error occurred during event convert');

    try {
      const { error } =  await this.supabase.createEvent(convertedEvent);
      
      if (error) {
        throw new Error(error.message);
      }

      return null;

    } catch (error) {

      console.error('Error creating event:', error);

      throw new Error('An error occurred while creating the event.');

    }

  };

  readEvents = async () => {

    try {
    
      const { data, error } = await this.supabase.readEvents()
    
      if (data) {
        const events: EventValidated[] = data.map(item => {
          return this.supabase.validateEventResponse(item);
        })
        return events
      }
    
      if (error) {
        throw new Error(error.message);
      }
    
      return null;
    
    } catch (error) {
    
      console.error('Error retrieving events:', error);
    
      throw new Error('An error occurred while retrieving the events.');
    
    }

  };

  updateEvent = async (event: EventValidated) => {

    const { user } = this.session

    const updatedEvent: EventValidated = {
      ...event,
      date_modified: new Date()
    };

    const convertedEvent = this.supabase.convertToEventRequest(updatedEvent, user);
    if (!convertedEvent) throw new Error('An error occurred during event convert');

    try {
    
      const { error } = await this.supabase.updateEvent(convertedEvent)
        
      if (error) {
        throw new Error(error.message);
      }
    
      return null;
    
    } catch (error) {
    
      console.error('Error updating event:', error);
    
      throw new Error('An error occurred while updating the event.');
    
    }
  };

  deleteEvent = async (event: EventValidated) => {

    const { user } = this.session

    const convertedEvent = this.supabase.convertToEventRequest(event, user);
    if (!convertedEvent) throw new Error('An error occurred during event convert');
  
    try {
  
      const { error } = await this.supabase.deleteEvent(convertedEvent)
    
      if (error) {
        throw new Error(error.message);
      }
  
      return null;
  
    } catch (error) {
  
      console.error('Error deleting event:', error);
  
      throw new Error('An error occurred while deleting the event.');
  
    }
  
  };

}
