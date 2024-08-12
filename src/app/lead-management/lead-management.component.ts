import { Component,OnInit  } from '@angular/core';
import { LeadService } from '../services/lead.service';
import { Router } from '@angular/router';
import { Lead } from '../models/lead.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-lead-management',
  templateUrl: './lead-management.component.html',
  styleUrls: ['./lead-management.component.css']
})
export class LeadManagementComponent implements OnInit {
  leads: Lead[] = [];
  newLead = { name: '', number: '', email: '', product: '' };
  isSubmitting = false;
  selectedLead: any = null;
  filteredLeads: Lead[] = [];
  searchTerm = '';
  sortColumn = '';
  sortDirection = 1;

  constructor(private leadService: LeadService,
              private router: Router) {}

  ngOnInit() {
    this.getLeads();
  }

  getLeads() {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (userId) {
      this.leadService.getLeads(userId).subscribe(
        (response) => {
          console.log('Fetched leads:', response);
          this.leads = response;
          this.filteredLeads = [...this.leads];
          this.filterLeads();
        },
        (error) => {
          if (error.status === 404) {
            //alert(`${error.error?.error || 'No leads found for this user'}`);
          } else {
            alert(`Error fetching leads: ${error.error?.error || 'An unknown error occurred'}`);
          }
        }
      );
    } else {
      alert('User ID not found. Please log in again.');
    }
  }

  onSubmit(leadForm: NgForm) {
    if (leadForm.valid) {
      this.selectedLead ? this.updateLead() : this.createLead();
    } else {
      leadForm.form.markAllAsTouched(); // Show validation errors
    }
  }

  validateEmail(leadForm: NgForm) {
    const emailControl = leadForm.controls['email'];
    if (emailControl && emailControl.invalid) {
      emailControl.markAsTouched();
    }
  }

  createLead() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    if (userId) {
      const leadData = { ...this.newLead, userId }; // Include userId in the lead data
      this.leadService.createLead(leadData).subscribe(
        () => {
          alert('Lead created successfully');
          this.getLeads();
          // this.clearForm();
          this.isSubmitting = false;
        },
        (error) => {
          alert('Error creating lead');
        }
      );
    } else {
      alert('User ID not found. Please log in again.');
      this.isSubmitting = false;
    }
  }



// Method to populate the form with the selected lead's details
  editLead(lead: any) {
    this.selectedLead = { ...lead };  // Copy the lead data to avoid two-way binding issues
    this.newLead = { ...lead };  // Populate newLead with the selected lead's data
  }
  // Method to update the lead
  updateLead() {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.selectedLead) {
      alert('User ID not found or no lead selected.');
      return;
    }

    if (this.selectedLead) {
      const updatedLead = {
        _id: this.selectedLead._id,
        name: this.newLead.name,
        number: this.newLead.number,
        email: this.newLead.email,
        product: this.newLead.product,
      };

      this.leadService.updateLead(userId, this.selectedLead._id, updatedLead).subscribe(
        (response) => {
          alert('Lead updated successfully');
          this.getLeads();  // Refresh the leads list
          // this.clearForm();
          this.isSubmitting = false;
        },
        (error) => {
          alert(`Error updating lead: ${error.error?.error || 'An unknown error occurred'}`);
          this.isSubmitting = false;
        }
      );
    }
  }

  deleteLead(leadId: string) {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    console.log('userId: ',userId, 'leadId: ',leadId);

    if (userId) {
      this.leadService.deleteLead(userId, leadId).subscribe(
        () => {
          alert('Lead deleted successfully');
          this.getLeads(); // Refresh the leads list
        },
        (error) => {
          alert('Error deleting lead: ' + (error.error?.error || 'Unknown error'));
        }
      );
    } else {
      alert('User ID not found. Please log in again.');
    }
  }

  // Logout function
  logout() {
    localStorage.removeItem('userId');  // Remove user session or token
    localStorage.removeItem('token');   // Remove token from localStorage
    this.router.navigate(['/login']);  // Redirect to login page
  }

  filterLeads() {
    this.filteredLeads = this.leads.filter(lead =>
      lead.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      lead.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      lead.product.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sortLeads(column: keyof Lead): void {
    if (this.sortColumn === column) {
      this.sortDirection = -this.sortDirection; // Toggle sort direction
    } else {
      this.sortColumn = column;
      this.sortDirection = 1; // Default to ascending
    }

    this.filteredLeads.sort((a: Lead, b: Lead): number => {
      const aValue = a[column];
      const bValue = b[column];

      // Convert values to string and lowercase only if they are strings
      const aStr = typeof aValue === 'string' ? (aValue as string)?.toLowerCase() : aValue;
      const bStr = typeof bValue === 'string' ? (bValue as string)?.toLowerCase() : bValue;

      if (aStr < bStr) return -1 * this.sortDirection;
      if (aStr > bStr) return 1 * this.sortDirection;
      return 0;
    });
  }

  // clearForm() {
  //   this.newLead = {
  //     name: '',
  //     number: '',
  //     email: '',
  //     product: ''
  //   };
  //   this.selectedLead = null;  // Reset the selected lead
  //
  // }

  clearForm(leadForm: NgForm) {
    this.newLead = {
      name: '',
      number: '',
      email: '',
      product: ''
    };
    this.selectedLead = null;  // Reset the selected lead
    leadForm.resetForm();  // Reset the form state
  }

}
