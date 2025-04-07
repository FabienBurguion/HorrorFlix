import { Component, Input } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';
import { Review } from '../../models/review';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [HomeComponent, CommonModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MovieComponent {
  @Input({ required: true }) movie!: Movie
  @Input() review?: Review;
}
