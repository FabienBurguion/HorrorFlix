import { Component, inject } from '@angular/core';
import { Review } from '../models/review';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Movie } from '../models/movie';
import { MoviesService } from '../services/movies.service';
import { User } from '../models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { ReviewService } from '../services/review.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-avis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-avis.component.html',
  styleUrl: './add-avis.component.scss'
})
export class AddAvisComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);
  private readonly reviewService = inject(ReviewService);

  constructor(private snackBar: MatSnackBar) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      this.user = JSON.parse(userData);
      this.review.user = this.user;
    } else {
      this.router.navigate(['/']);
    }

    this.moviesService.getMovies().subscribe((movies) => {
      this.movies = movies;
    });

    const reviewId = this.route.snapshot.paramMap.get('id');
    if (reviewId) {
      this.isEditMode = true;
      this.reviewService.getReviewById(+reviewId).subscribe((r) => {
        if (r) {
          this.review = r;
          this.selectedMovieId = r.movie.id!;
        }
      });
    }
  }

  review: Review = {
    id: 0,
    user: {
      id: 0,
      firstName: '',
      lastName: '',
      age: 0,
      email: '',
      points: 0,
    },
    movie: {
      id: 0,
      title: '',
      releaseDate: new Date(),
      director: '',
      rate: 0,
      synopsis: '',
      image: '',
    },
    rate: 5,
    text: '',
    reviewDate: new Date(),
  };

  selectedMovieId: number | null = null;
  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    points: 0,
  };

  movies: Movie[] = [];
  isEditMode = false;

  submitReview() {
    console.log('submitReview called');
    if (!this.selectedMovieId) {
      this.snackBar.open('Veuillez sélectionner un film', 'Fermer', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    const selectedMovie = this.movies.find(m => m.id === Number(this.selectedMovieId));

    if (selectedMovie) {
      this.review.movie = selectedMovie;
      this.review.reviewDate = new Date();

      if (this.isEditMode && this.review.id) {
        this.reviewService.updateReview(this.review).subscribe(() => {
          this.router.navigate(['/list-avis', this.user.id]);
        });
      } else {
        console.log('addReview called');
        this.reviewService.addReview(this.review).subscribe(() => {
          this.router.navigate(['/list-avis', this.user.id]);
        });
      }
    } else {
      this.snackBar.open('Film introuvable.', 'Fermer', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  goToMyReviews(): void {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      const user = JSON.parse(userData);
      this.router.navigate(['/list-avis', user.id]);
    }
  }
}
