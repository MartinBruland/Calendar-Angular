import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AuthSession } from '@supabase/supabase-js'
import { SupabaseService } from '../../app/supabase.service'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'

import { Profile } from 'src/types/types'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  @Input() session!: AuthSession;

  profile!: Profile;

  _avatarUrl: SafeResourceUrl | undefined;

  updateProfileForm = this.formBuilder.group({
    first_name: '',
    last_name: '',
    avatar_url: '',
  });


  constructor(
    private readonly supabase: SupabaseService, 
    private formBuilder: FormBuilder,
    private readonly dom: DomSanitizer
  ) {};

  async ngOnInit(): Promise<void> {
    
    const data = await this.getProfile();
    
    if (!data) return;
    
    this.profile = data;

    this._avatarUrl = this.downloadImage(data.avatar_url);

    const { first_name, last_name, avatar_url } = data;

    this.updateProfileForm.patchValue({
      first_name,
      last_name,
      avatar_url,
    })

  };

  getProfile = async () => {

    if(!this.session) return;
    
    const { user } = this.session;

    try {
    
      const { data, error } = await this.supabase.readProfile(user);
    
      if (data) {
        return data
      };
    
      if (error) {
        throw new Error(error.message);
      };
    
      return null;
    
    } catch (error) {
    
      console.error('Error retrieving profile:', error);
    
      throw new Error('An error occurred while retrieving the profile.');
    
    };

  };

  updateProfile = async () => {

      const { user } = this.session;

      const first_name = this.updateProfileForm.value.first_name as string;
      const last_name = this.updateProfileForm.value.last_name as string;
      const avatar_url = this.updateProfileForm.value.avatar_url as string;

      const updatedData = {
        first_name,
        last_name,
        avatar_url,
        id: user.id,
        updated_at: new Date(),
      };
  
      try {

        const { data, error } = await this.supabase.updateProfile(updatedData);

        if (data) {
          return data;
        };

        if (error) {
          throw new Error(error.message);
        };

        return null;

      } catch (error) {
        
        console.error('Error updating profile:', error);
        
        throw new Error('An error occurred while updating the profile.');

      };

  };
  
  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path)
      if (data instanceof Blob) {
        return this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error downloading image: ', error.message)
      }
    }
    return null
  };

  async uploadAvatar(event: any) {
    try {
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      };

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Math.random()}.${fileExt}`;

      await this.supabase.uploadAvatar(filePath, file);

    } catch (error) {

      if (error instanceof Error) {
        
        console.error('Error uploading avatar:', error);
        
        throw new Error('An error occurred while uploading the avatar.');

      };

    };

  };
  
}