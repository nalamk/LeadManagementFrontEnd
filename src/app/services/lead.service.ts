import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private baseUrlLocal = 'http://localhost:3000/leads'; // Change this URL to your backend server
  private baseUrl = 'https://login-lead-app.azurewebsites.net/leads'; // Change this URL to your backend server
  constructor(private http: HttpClient) { }

  // Fetch leads for the logged-in user
  getLeads(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${userId}`, this.getAuthHeaders());
  }

  // Create a new lead
  createLead(leadData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, leadData, this.getAuthHeaders());
  }

  // Update an existing lead
  updateLead(userId: string, leadId: string, leadData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/${leadId}`, leadData, this.getAuthHeaders());
  }


  // Delete a lead
  deleteLead(userId: string, leadId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}/${leadId}`, this.getAuthHeaders());
  }


  // Get HTTP headers with authorization token
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
}
