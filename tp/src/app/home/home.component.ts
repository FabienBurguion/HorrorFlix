import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { CommonModule } from '@angular/common';
import { MovieComponent } from './movie/movie.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MovieComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly moviesService = inject(MoviesService)
  movies$: Observable<Movie[]> = this.moviesService.getMovies()


  @ViewChild('carousel', { static: true }) carouselRef!: ElementRef;

  scrollCarousel(direction: 'left' | 'right') {
    const el = this.carouselRef.nativeElement;
    const scrollAmount = 300;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  trackById(index: number, movie: Movie) {
    return movie.id;
  }

}
