import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.scss'
})
export class AddMovieComponent {
  movie: Movie = {
    title: '',
    director: '',
    releaseDate: new Date(),
    synopsis: '',
    id: undefined,
    rate: undefined,
    image: undefined
  };

  private readonly route = inject(ActivatedRoute)

  constructor(private snackBar: MatSnackBar) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id) && id > 0) {
      this.moviesService.getMovieById(id).subscribe((m) => {
        this.movie = m;
      });
    }
  }

  submitMovie(): void {
    if (this.movie.id && this.movie.id > 0) {
      this.updateMovie();
    } else {
      this.addMovie();
    }
  }

  private readonly moviesService = inject(MoviesService)
  private readonly router = inject(Router)

  addMovie(): void {
    const isUpperCase = this.movie.title === this.movie.title.toUpperCase();

    const checkDirector = /^[a-zA-Z]+ [a-zA-Z]+$/;
    const isDirectorValid = checkDirector.test(this.movie.director);

    const releaseDate = new Date(this.movie.releaseDate);
    const isFutureRelease = releaseDate.getTime() > Date.now();
    const isSynopsisLongEnough = this.movie.synopsis.length >= 30;

    if (isUpperCase && isDirectorValid && isFutureRelease && isSynopsisLongEnough) {
      this.movie.id = undefined;
      this.moviesService.addMovie(this.movie).subscribe(() => {
        this.router.navigate(['/movies']);
      });
    } else {
      this.snackBar.open('Veuillez remplir tous les champs correctement.', 'Fermer', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  updateMovie(): void {
    this.moviesService.updateMovie(this.movie).subscribe(() => {
      this.router.navigate(['/movies']);
    });
  }
}