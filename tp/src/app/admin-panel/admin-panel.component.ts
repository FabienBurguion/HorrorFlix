import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js/auto';
import { forkJoin } from 'rxjs';
import { Movie } from '../models/movie';
import { Review } from '../models/review';
import { MoviesService } from '../services/movies.service';
import { ReviewService } from '../services/review.services';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

interface MovieWithRating {
  title: string;
  averageRating: number;
}

interface MonthlyReviews {
  month: string;
  count: number;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, AfterViewInit {
  @ViewChild('NoteParFilmChart') chartNote!: ElementRef;
  @ViewChild('NbreAvisParAnneeChart') chartAvis!: ElementRef;

  ratingChart: Chart | undefined;
  AvisChart: Chart | undefined;
  movies: Movie[] = [];
  reviews: Review[] = [];
  movieRatings: MovieWithRating[] = [];
  isLoading = true;
  monthlyReviews: MonthlyReviews[] = [];
  selectedYear: number = new Date().getFullYear();
  error: string | null = null;
  chartsCreated = {
    ratings: false,
    monthly: false
  };
  monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];

  private readonly moviesService = inject(MoviesService);
  private readonly reviewService = inject(ReviewService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;

    forkJoin({
      movies: this.moviesService.getMovies(),
      reviews: this.reviewService.getReviews()
    }).subscribe({
      next: (data) => {
        this.movies = data.movies;
        this.reviews = data.reviews;
        this.calculateAverageRatings();
        this.calculateMonthlyReviews(this.selectedYear);
        this.isLoading = false;

        setTimeout(() => {
          this.tryCreateRatingChart();
          this.tryCreateMonthlyChart();
        }, 0);
      }
    });
  }

  calculateAverageRatings(): void {
    this.movieRatings = this.movies.map(movie => {
      const movieReviews = this.reviews.filter(review => review.id === movie.id);
      const totalRating = movieReviews.reduce((sum, review) => sum + review.rate, 0);
      const averageRating = movieReviews.length > 0 ? totalRating / movieReviews.length : 0;

      return {
        title: movie.title,
        averageRating: averageRating
      };
    });

  }

  calculateMonthlyReviews(year: number): void {
    const monthlyCounts = Array(12).fill(0);

    this.reviews.forEach(review => {
      const reviewDate = new Date(review.reviewDate);

      if (reviewDate.getFullYear() === year) {
        const month = reviewDate.getMonth();
        monthlyCounts[month]++;
      }
    });

    this.monthlyReviews = this.monthNames.map((name, index) => ({
      month: name,
      count: monthlyCounts[index]
    }));
  }

  onYearChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedYear = parseInt(select.value, 10);
    this.calculateMonthlyReviews(this.selectedYear);

    if (this.AvisChart) {
      const monthlyData = this.monthlyReviews.map(item => item.count);
      this.AvisChart.data.datasets[0].data = monthlyData;
      this.AvisChart.update();
    } else {
      this.tryCreateMonthlyChart();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tryCreateRatingChart();
      this.tryCreateMonthlyChart();
    }, 0);
  }

  tryCreateRatingChart(): void {

    if (!this.isLoading && this.movieRatings.length > 0 && this.chartNote && !this.chartsCreated.ratings) {
      this.createRatingChart();
    }
  }

  tryCreateMonthlyChart(): void {
    if (!this.isLoading && this.monthlyReviews.length > 0 && this.chartAvis && !this.chartsCreated.monthly) {
      this.createMonthlyChart();
    }
  }

  createRatingChart(): void {
    if (!this.chartNote) {
      console.error('Graph sur les avis ne marchent pas');
      return;
    }

    if (this.ratingChart) {
      this.ratingChart.destroy();
    }

    const ctx = this.chartNote.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('error');
      return;
    }

    const movieTitles = this.movieRatings.map(movie => movie.title);
    const ratings = this.movieRatings.map(movie => movie.averageRating);

    const filmData = {
      labels: movieTitles,
      datasets: [{
        label: 'Note par film',
        data: ratings,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgb(255, 206, 86)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(255, 206, 86)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 206, 86)',
        tension: 0.1
      }]
    };

    try {
      this.ratingChart = new Chart(ctx, {
        type: 'line',
        data: filmData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 2.5,
              max: 5.0,
              ticks: {
                stepSize: 0.5
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Note par film',
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            }
          }
        }
      });

      this.chartsCreated.ratings = true;
    } catch (error) {
      console.error('Erreur sur les avis', error);
    }
  }

  createMonthlyChart(): void {
    if (!this.chartAvis) {
      console.error('erreur');
      return;
    }
    if (this.AvisChart) {
      this.AvisChart.destroy();
    }

    const ctx = this.chartAvis.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('erreur');
      return;
    }

    const months = this.monthlyReviews.map(item => item.month);
    const counts = this.monthlyReviews.map(item => item.count);

    const monthlyData = {
      labels: months,
      datasets: [{
        label: "Nombre d'avis",
        data: counts,
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgb(255, 206, 86)',
        borderWidth: 1
      }]
    };

    try {
      this.AvisChart = new Chart(ctx, {
        type: 'bar',
        data: monthlyData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 0.5
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: "Nombre d'avis par année",
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            }
          }
        }
      });

      this.chartsCreated.monthly = true;
    } catch (error) {
      console.error('erreur sur le graph avis', error);
    }
  }
}