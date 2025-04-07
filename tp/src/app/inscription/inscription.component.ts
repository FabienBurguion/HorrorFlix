import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../services/user.services';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.scss'
})
export class InscriptionComponent {
  private readonly usersService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  user: User = {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    points: 0,
  };

  isEditMode = false;

  constructor(private snackBar: MatSnackBar) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.usersService.getUserById(+id).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });
    }
  }

  addUser(): void {
    if (!this.user.firstName || !this.user.lastName || !this.user.email || this.user.age === 0) {
      this.snackBar.open('Veuillez remplir tous les champs.', 'Fermer', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    if (this.isEditMode && this.user.id !== undefined) {
      this.usersService.updateUser(this.user).subscribe((updatedUser) => {
        localStorage.setItem('loggedUser', JSON.stringify(updatedUser));
        this.router.navigate(['/user-page']);
      });
    } else {
      this.usersService.addUser(this.user).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}
