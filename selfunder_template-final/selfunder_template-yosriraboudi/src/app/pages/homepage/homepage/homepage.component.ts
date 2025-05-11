import { Contact } from './../../../core/models/Contact';
import { ContactService } from './../../../core/services/contact.service';
import { Component } from '@angular/core';
import { ReclamationService } from '../../../core/services/reclamation.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';



@Component({
  selector: 'app-homepage',
  standalone: false,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  // Initialisation de l'objet contact pour le binding avec le formulaire
  contact: Contact = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  // Indicateur de chargement pour l'interface utilisateur
  isSubmitting: boolean = false;

  constructor(private ContactService: ContactService) {}

  // Méthode appelée lors de la soumission du formulaire
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return; // Ne pas soumettre si le formulaire est invalide
    }

    this.isSubmitting = true; // Afficher un indicateur de chargement

    this.ContactService.createContact(this.contact).subscribe({
      next: (response) => {
        console.log('Contact créé avec succès', response);
        this.resetForm(form); // Réinitialiser le formulaire après succès
        this.isSubmitting = false;

      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi', error);
        this.isSubmitting = false;

      }
    });
  }

  // Méthode pour réinitialiser le formulaire
  resetForm(form: NgForm): void {
    this.contact = {
      name: '',
      email: '',
      phone: '',
      message: ''
    };
    form.resetForm(); // Réinitialiser l'état du formulaire Angular
  }

  // Méthode utilitaire pour vérifier si un champ est invalide
  isFieldInvalid(field: string, form: NgForm): boolean {
    const control = form.controls[field];
    return control?.invalid && (control?.touched || control?.dirty);
  }
}
