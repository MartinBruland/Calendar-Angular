import { Component, ChangeDetectorRef, OnInit} from '@angular/core';
import { SupabaseService } from './supabase.service'

import { EventValidated, Profile } from 'src/types/types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  labelTitle = 'Calendar';
  labelCopyright = '@ Martin Bruland, 2023';
  labelDarkMode = 'Dark';


  session = this.supabase.session;

  profile!: Profile;

  events: EventValidated[] = [];

  selectedDate: Date | undefined = undefined;

  selectedTag: string | undefined = undefined;

  isSettingsViewVisible = false;

  isDarkMode = false;


  constructor(
    private cdr: ChangeDetectorRef, 
    private readonly supabase: SupabaseService,
  ) {};

  ngOnInit(): void {
    this.supabase.authChanges((_, session) => {
      this.session = session;
    });

/*      error fordi jeg ikke er logget inn..
const data = await this.getProfile();
    if (data) {
      this.profile = data;
    } 
*/

  };

  getProfile = async () => {

    if (!this.session) return;

    const { user } = this.session

    try {
    
      const { data, error } = await this.supabase.readProfile(user)
    
      if (data) {
        return data;
      }
    
      if (error) {
        throw new Error(error.message);
      }
    
      return null;
    
    } catch (error) {
    
      console.error('Error retrieving profile:', error);
    
      throw new Error('An error occurred while retrieving the profile.');
    
    }

  };

  receiveSelectedDate(date: Date) {
    this.selectedDate = date;
  };

  receiveSelectedTag(tag: string) {
    this.selectedTag = tag;
  };

  receiveCalendarEvents(events: EventValidated[]) {
    this.events = events;
    this.cdr.detectChanges();
  };

  setDarkMode = () => {
    this.isDarkMode = !this.isDarkMode;
    this.labelDarkMode = this.isDarkMode ? "Light" : "Dark";
  };

  setSettingsView = () => {
    this.isSettingsViewVisible = !this.isSettingsViewVisible;
  };

  signOut = async () => {
    await this.supabase.signOut()
  };

}