import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { UserService } from '../../../service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-homepage-entreproneur',
  standalone: false,
  templateUrl: './homepage-entreproneur.component.html',
  styleUrl: './homepage-entreproneur.component.scss'
})
export class HomepageEntreproneurComponent implements OnInit {
  users: User[] = [];             // Tous les utilisateurs
  filteredUsers: User[] = [];     // Résultat filtré
  searchTerm: string = '';        // Terme de recherche

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data; // Initialiser le tableau filtré
        console.log('Utilisateurs chargés :', this.users);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action supprimera définitivement le profil.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter(u => u.idUser !== id);
            this.searchUsers(); // Mettre à jour la liste filtrée
            Swal.fire(
              'Supprimé !',
              'Le profil a été supprimé avec succès.',
              'success'
            );
          },
          error: (err) => {
            console.error('Erreur suppression :', err);
            Swal.fire(
              'Erreur',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          }
        });
      }
    });
  }

  searchUsers(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nom?.toLowerCase().includes(term)
    );
  }
}
