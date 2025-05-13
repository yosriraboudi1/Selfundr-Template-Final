import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Formation, FormationService, StatutFormation, TypeFormation } from '../../../core/services/formation.service';

@Component({
  selector: 'app-formationform',
  standalone: false,
  templateUrl: './formationform.component.html',
  styleUrl: './formationform.component.scss'
})
export class FormationformComponent  implements OnInit {
  formationForm!: FormGroup;
  formationId: number | null = null;
  isEditMode = false;
  typeFormationOptions = Object.values(TypeFormation);
  statutFormationOptions = Object.values(StatutFormation);
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Vérifier si nous sommes en mode édition (si un ID est présent dans l'URL)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.formationId = +id;
        this.isEditMode = true;
        this.loadFormationData(this.formationId);
      }
    });
  }

  initForm(): void {
    this.formationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      duree: [0, [Validators.required, Validators.min(1)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      certificat: [false],
      typeFormation: [TypeFormation.WEBINAIR, Validators.required],
      statutFormation: [StatutFormation.En_Cours, Validators.required],
      formationFileUrl: ['']
    });
  }

  loadFormationData(id: number): void {
    this.formationService.getFormationById(id).subscribe({
      next: (formation) => {
        this.formationForm.patchValue({
          titre: formation.titre,
          description: formation.description,
          duree: formation.duree,
          prix: formation.prix,
          certificat: formation.certificat,
          typeFormation: formation.typeFormation,
          statutFormation: formation.statutFormation,
          formationFileUrl: formation.formationFileUrl
        });
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la formation', err);
        alert('Erreur lors du chargement de la formation');
      }
    });
  }

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  onSubmit(): void {
    if (this.formationForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.formationForm.controls).forEach(key => {
        const control = this.formationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formationData: Formation = this.formationForm.value;

    // Utiliser FormData pour gérer le téléchargement de fichiers
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    // Ajouter les données du formulaire à formData
    Object.keys(formationData).forEach(key => {
      if (formationData[key as keyof Formation] !== null && formationData[key as keyof Formation] !== undefined) {
        formData.append(key, String(formationData[key as keyof Formation]));
      }
    });

    if (this.isEditMode && this.formationId) {
      // Mise à jour d'une formation existante
      this.formationService.updateFormation(this.formationId, formationData, this.selectedFile).subscribe({
        next: () => {
          alert('Formation mise à jour avec succès');
          this.router.navigate(['/formation/list']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour de la formation', err);
          alert('Erreur lors de la mise à jour de la formation');
        }
      });
    } else {
      // Création d'une nouvelle formation
      this.formationService.createFormation(formationData, this.selectedFile).subscribe({
        next: () => {
          alert('Formation créée avec succès');
          this.router.navigate(['formation/list']);
        },
        error: (err) => {
          console.error('Erreur lors de la création de la formation', err);
          alert('Erreur lors de la création de la formation');
        }
      });
    }
  }

  // Ajouter une méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.formationForm.reset({
      titre: '',
      description: '',
      duree: 0,
      prix: 0,
      certificat: false,
      typeFormation: TypeFormation.WEBINAIR,
      statutFormation: StatutFormation.En_Cours,
      formationFileUrl: ''
    });
    this.selectedFile = null;
  }

  // Ajouter une méthode pour naviguer vers la liste des formations
  cancel(): void {
    this.router.navigate(['formation/list']);
  }
}
