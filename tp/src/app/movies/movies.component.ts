import { Component, DestroyRef, inject } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent {
  private readonly moviesService = inject(MoviesService);
  movies$: Observable<Movie[]> = this.moviesService.getMovies();

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id!;
  }

  private readonly router = inject(Router);

  private destroyRef = inject(DestroyRef)
  deleteMovie(id: number): void {
    this.moviesService.deleteMovie(id!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() =>
      this.movies$ = this.moviesService.getMovies()
    );
  }

  updateMovie(id: number): void {
    this.router.navigate(['/add-movie', id]);
  }
}
