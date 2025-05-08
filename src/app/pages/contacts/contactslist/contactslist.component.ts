import { Contact } from '../../../core/models/Contact';
import { ContactService } from '../../../core/services/contact.service';
import { Component, OnInit } from '@angular/core';

declare var bootstrap: any;
@Component({
  selector: 'app-contactslist',
  templateUrl: './contactslist.component.html',
  styleUrls: ['./contactslist.component.scss']
})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedMessage: string = '';
  isSidebarOpen: boolean = false;

  constructor(private ContactService: ContactService) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.ContactService.getAllContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
      }
    });
  }

  openDescriptionModal(message: string): void {
    this.selectedMessage = message;
    const modal = document.getElementById('messageModal');
    if (modal) {
      const bootstrapModal = new bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }
  openSidebar(message: string): void {
    this.selectedMessage = message;
    this.isSidebarOpen = true; // Ouvre la sidebar
  }

  closeSidebar(): void {
    this.isSidebarOpen = false; // Ferme la sidebar
  }

}
