import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrlLocal = 'http://localhost:3000/auth'; // Change this URL to your backend server
  private baseUrl = 'https://login-lead-app.azurewebsites.net/auth';
  constructor(private http: HttpClient) { }

  // Sign up a new user
  signup(name: string, username: string, password: string): Observable<any> {
    const payload = { name, username, password };
    return this.http.post(`${this.baseUrl}/signup`, payload, { observe: 'response' });
  }

  // Login an existing user
  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? true : false;
  }

  // Log out the user
  logout(): void {
    localStorage.removeItem('token');
  }

  resetPassword(username: string, newPassword: string): Observable<any> {
    const payload = { username, newPassword };
    return this.http.put(`${this.baseUrl}/reset-password`, payload);
  }

  // Get the JWT token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
