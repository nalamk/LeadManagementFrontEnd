import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  onSubmit(loginForm: NgForm) {
    if (loginForm.valid) {
      // Handle successful login logic here
      console.log('Form submitted successfully');

      this.login();
    } else {
      // Trigger validation messages by marking the form as submitted
      loginForm.form.markAllAsTouched();
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        console.log(response);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/leads']);
        alert('Login successful');
      },
      (error) => {
        if(error.status === 400) {
          alert('Invalid username or password. Please try again.');
        } else {
          alert('Login failed');
        }

      }
    );
  }
}
