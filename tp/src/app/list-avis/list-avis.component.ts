import { Component, DestroyRef, inject } from '@angular/core';
import { ReviewService } from '../services/review.services';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-avis',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-avis.component.html',
  styleUrl: './list-avis.component.scss'
})
export class ListAvisComponent {
  private readonly reviewService = inject(ReviewService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  review$!: Observable<Review[]>;
  private userId: number | null = null;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const userIdParam = params.get('id');
      this.userId = userIdParam ? +userIdParam : null;
      this.loadReviews();
    });
  }

  private loadReviews(): void {
    if (this.userId !== null) {
      this.review$ = this.reviewService.getReviews().pipe(
        map(reviews => reviews.filter(review => review.user.id === this.userId))
      );
    } else {
      this.review$ = this.reviewService.getReviews();
    }
  }

  trackByReviewId(index: number, review: Review): number {
    return review.id!;
  }

  deleteReview(id: number): void {
    this.reviewService.deleteReview(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.loadReviews();
    });
  }

  updateReview(id: number): void {
    this.router.navigate(['/add-avis', id]);
  }
}