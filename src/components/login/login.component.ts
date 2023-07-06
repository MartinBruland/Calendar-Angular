import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { SupabaseService } from '../../app/supabase.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  showMessage = false;
  message = "";

  

  signInForm = this.formBuilder.group({
    email: '',
  });

  constructor(
    private readonly supabase: SupabaseService,
    private readonly formBuilder: FormBuilder
  ) {};

  async onSubmit(): Promise<void> {
    try {
      this.message = "Check your email for the login link!";
      this.showMessage = true

      const email = this.signInForm.value.email as string
      const { error } = await this.supabase.signIn(email)
      if (error) throw error
      
    } catch (error) {
      if (error instanceof Error) {
        this.message = error.message;
        this.showMessage;
      }
    } finally {
      this.signInForm.reset()
    }
  };

}