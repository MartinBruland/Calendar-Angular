import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarEvent } from 'src/types/types';
import { SupabaseService } from './supabase.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  session = this.supabase.session;

  displaySettings = false;
  
  darkmode = false;

  labelTitle = 'Calendar';
  labelCopyright = '@ Martin Bruland, 2023';
  labelDarkMode = this.darkmode ? "Light" : "Dark";

  selectedDate: Date | undefined = undefined;

  selectedTag: string | undefined = undefined;

  events: CalendarEvent[] = [];

  constructor(private cdr: ChangeDetectorRef, private readonly supabase: SupabaseService) {};
  
  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session));
  };

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

  setDisplaySettings = () => {
    this.displaySettings = !this.displaySettings;
  }

  async signOut() {
    await this.supabase.signOut()
  };
  
}