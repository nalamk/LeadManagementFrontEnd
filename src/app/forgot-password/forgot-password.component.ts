import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {NgForm} from "@angular/forms";
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  username: string = '';
  newPassword: string = '';
  isSubmitting: boolean = false;
  passwordPattern: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{7,}$";

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(resetForm: NgForm) {
    if (resetForm.valid) {
      // Handle successful login logic here
      console.log('Form submitted successfully');

      this.resetPassword();
    } else {
      // Trigger validation messages by marking the form as submitted
      resetForm.form.markAllAsTouched();
    }
  }

  resetPassword() {
    this.isSubmitting = true;
    this.authService.resetPassword(this.username, this.newPassword).subscribe(
        () => {
          alert('Password reset successfully');
          this.router.navigate(['/login']); // Redirect to login page after success
        },
        (error) => {
          if(error.status === 404) {
            alert('User not found. Please check the username and try again.');
          } else {
            alert('Error resetting password');
          }

        }
    );
  }
}
