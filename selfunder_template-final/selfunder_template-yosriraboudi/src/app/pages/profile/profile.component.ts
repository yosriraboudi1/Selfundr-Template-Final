import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserService} from "../../Service/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  email: string = localStorage.getItem('email') || ''; // Récupération de l'email du localStorage
  photoUrl: string | null = null;

  updateSuccess: boolean = false;
  updateError: boolean = false;
  updateErrorMessage: string = '';

  constructor(private userService: UserService, private modalService: NgbModal,private router: Router) {}

  ngOnInit(): void {
    if (this.email) {
      // Récupérer les informations utilisateur depuis l'API avec l'email
      this.userService.getUserByEmail(this.email).subscribe({
        next: (data) => {
          this.user = {
            ...data,
            firstName: data.prenom,
            lastName: data.nom,
            photoUrl: data.photo || 'assets/images/default-profile.jpg',
            profession: data.profession,
            email: data.email,
            phone: data.numTel,
            dateOfBirth: this.formatDateForInput(data.dateNaissance),
            cin: data.cin.toString(),
            address: data.adresse,
            taxId: data.matriculeFiscale,
            salary: data.salaire,
            portfolioValue: 250000,
            availableBalance: 15000,
            savings: 50000,
            investments: 185000,
            financialScore: 850,
            password: '',
          };
        },
        error: (err) => {
          console.error('Failed to load user profile:', err);
        },
      });
    } else {
      console.error('No email found in localStorage');
    }
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // yyyy-MM-dd
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.photoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onEditPhoto(): void {
    console.log('Edit photo clicked');
  }

  onOpenSettings(): void {
    console.log('Settings clicked');
  }

  onEditProfileModal(content: any): void {
    this.modalService.open(content);
  }

  onSaveProfile(): void {
    if (!this.email) {
      console.error("Missing user email!");
      return;
    }

    const updatedUser = {
      ...this.user,
      nom: this.user.lastName,
      prenom: this.user.firstName,
      numTel: this.user.phone,
      adresse: this.user.address,
      salaire: this.user.salary,
      profession: this.user.profession,
      dateNaissance: this.user.dateOfBirth,
      cin: this.user.cin,
      matriculeFiscale: this.user.taxId,
      photo: this.user.photoUrl,
    };

    this.userService.updateUserByEmail(this.email, updatedUser).subscribe({
      next: (data) => {
        this.user = data;
        this.updateSuccess = true;
        this.updateError = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.updateSuccess = false;
        this.updateError = true;
        this.updateErrorMessage = 'Failed to update profile.';
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return ''; // ou retourne 'Non défini' selon ton cas

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Vérifie si la date est invalide

    return date.toLocaleDateString('fr-FR'); // ou utilise Intl.DateTimeFormat si tu préfères
  }

  logout(): void {
    localStorage.clear(); // Supprime tout du localStorage
    this.router.navigate(['/']);
  }

  getFinancialScoreColor(score: number): string {
    if (score >= 800) return '#00b894';
    if (score >= 700) return '#00cec9';
    if (score >= 600) return '#fdcb6e';
    return '#ff7675';
  }
}
