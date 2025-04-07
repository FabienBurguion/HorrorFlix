import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-space',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss'
})
export class ConnectionComponent {
  email = '';
  private readonly usersService = inject(UserService);
  private readonly router = inject(Router);

  constructor(private snackBar: MatSnackBar) {
    const existingUser = localStorage.getItem('loggedUser');
    if (existingUser) {
      this.router.navigate(['/user-page']);
    }
  }

  login(): void {
    if (this.email === '') {
      this.snackBar.open('Please enter your email', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }
    this.usersService.getUserByEmail(this.email).subscribe((user) => {
      if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        this.router.navigate(['/user-page']);
      } else {
        alert('User not found.');
      }
    });
  }
}
