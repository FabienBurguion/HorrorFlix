import { Component, Input } from '@angular/core';
import { HomeComponent } from '../home.component';
import { Movie } from '../../models/movie';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [HomeComponent, CommonModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  @Input({ required: true }) movie!: Movie
}
