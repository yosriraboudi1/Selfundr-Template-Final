import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReclamationService } from '../../../core/services/reclamation.service';

@Component({
  selector: 'app-add-reclamation',
  templateUrl: './add-reclamation.component.html',
  styleUrls: ['./add-reclamation.component.scss']
})
export class AddReclamationComponent {
  reclamation = {
    sujet: '',
    description: '',
    file: undefined as File | undefined // Propriété pour stocker le fichier
  };

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  // Méthode pour gérer la sélection de fichier
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.reclamation.file = file || undefined; // Assign undefined instead of null
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    const userId = 1; // ID utilisateur temporaire fixé à 1

    // Create the JSON structure expected by the backend
    const reclamationData = {
        sujet: this.reclamation.sujet,
        description: this.reclamation.description
    };

    // Appeler le service pour créer la réclamation
    this.reclamationService.createReclamation(userId, reclamationData, this.reclamation.file).subscribe({
      next: (id) => {
        console.log('Réclamation créée avec ID:', id);
        this.router.navigate(['/reclamation/listbyuser']);
      },
      error: (err) => {
        console.error('Erreur lors de la création de la réclamation:', err);
        alert('Une erreur est survenue lors de la création de la réclamation.');
      }
    });
}
}
