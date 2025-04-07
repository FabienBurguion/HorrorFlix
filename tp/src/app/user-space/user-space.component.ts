import { Component } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { MovieComponent } from './movies/movies.component';
import { map, Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { ReviewService } from '../services/review.services';
import { Review } from '../models/review';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-space',
  standalone: true,
  imports: [MovieComponent, CommonModule],
  templateUrl: './user-space.component.html',
  styleUrl: './user-space.component.scss'
})
export class UserSpaceComponent {
  user: User = {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    age: 0,
    points: 0,
  };
  reviews$!: Observable<{ movie: Movie; review: Review }[]>;

  constructor(
    private router: Router,
    private reviewService: ReviewService
  ) {
    const userData = localStorage.getItem('loggedUser');
    if (userData) {
      this.user = JSON.parse(userData);

      this.reviews$ = this.reviewService.getReviews().pipe(
        map((reviews: Review[]) =>
          reviews
            .filter(r => r.user.id === this.user.id)
            .map(r => ({ movie: r.movie, review: r }))
        )
      );
    } else {
      this.router.navigate(['/connexion']);
    }
  }

  trackByMovieId(index: number, item: { movie: Movie; review: Review }): number {
    return item.movie.id!;
  }
  logout(): void {
    localStorage.removeItem('loggedUser');
    this.router.navigate(['/connection']);
  }
  addReview(): void {
    this.router.navigate(['/add-avis']);
  }
  editMyReviews(): void {
    if (this.user?.id != null) {
      this.router.navigate(['/list-avis', this.user.id]);
    }
  }
  editMyInfos(): void {
    if (this.user?.id != null) {
      this.router.navigate(['/add-user', this.user.id]);
    }
  }
}
