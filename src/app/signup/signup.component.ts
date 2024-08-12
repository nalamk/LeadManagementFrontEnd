import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  username: string = '';
  password: string = '';
  passwordPattern: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{7,}$";

  constructor(private authService: AuthService,
              private router: Router) {}

  onSubmit(signupForm: NgForm) {
    if (signupForm.valid) {
      // Handle successful login logic here
      console.log('Form submitted successfully');

      this.signup();
    } else {
      // Trigger validation messages by marking the form as submitted
      signupForm.form.markAllAsTouched();
    }
  }

  signup() {
    this.authService.signup(this.name, this.username, this.password).subscribe(
      (response) => {
        if (response && response.status === 201) {
          alert(response.body?.message || 'Signup successful');
          this.router.navigate(['/login']);
        } else {
          alert('Signup successful'); // Fallback message
        }
      },
      (error) => {
        alert('Signup failed: '+(error.error?.message || 'Unknown error'));
      }
    );
  }
}
