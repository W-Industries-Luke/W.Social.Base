import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Post, PostInteraction } from '../models/post.interface';
import { PostComponent } from './post.component';

@Component({
  selector: 'wsb-feed',
  standalone: true,
  imports: [CommonModule, PostComponent],
  template: `
    <div class="feed-container">
      <div class="feed-header" *ngIf="title">
        <h2 class="feed-title">{{ title }}</h2>
        <p class="feed-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      
      <div class="feed-loading" *ngIf="loading">
        <div class="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
      
      <div class="feed-empty" *ngIf="!loading && (!posts || posts.length === 0)">
        <div class="empty-icon">📱</div>
        <h3>No posts yet</h3>
        <p>{{ emptyMessage || 'Be the first to share something!' }}</p>
      </div>
      
      <div class="feed-posts" *ngIf="!loading && posts && posts.length > 0">
        <wsb-post
          *ngFor="let post of posts; trackBy: trackByPostId"
          [post]="post"
          (like)="onPostLike($event)"
          (repost)="onPostRepost($event)"
          (comment)="onPostComment($event)"
        ></wsb-post>
      </div>
      
      <div class="feed-load-more" *ngIf="hasMore && !loading">
        <button 
          class="load-more-button"
          (click)="onLoadMore()"
          [disabled]="loadingMore"
        >
          {{ loadingMore ? 'Loading...' : 'Load More Posts' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 16px;
    }
    
    .feed-header {
      margin-bottom: 24px;
      text-align: center;
    }
    
    .feed-title {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 700;
      color: #14171a;
    }
    
    .feed-subtitle {
      margin: 0;
      font-size: 16px;
      color: #657786;
    }
    
    .feed-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 16px;
      text-align: center;
    }
    
    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1da1f2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .feed-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 16px;
      text-align: center;
      color: #657786;
    }
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.6;
    }
    
    .feed-empty h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: #14171a;
    }
    
    .feed-empty p {
      margin: 0;
      font-size: 16px;
    }
    
    .feed-posts {
      margin-bottom: 24px;
    }
    
    .feed-load-more {
      display: flex;
      justify-content: center;
      padding: 16px;
    }
    
    .load-more-button {
      background: #1da1f2;
      color: white;
      border: none;
      border-radius: 24px;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .load-more-button:hover:not(:disabled) {
      background: #1991da;
    }
    
    .load-more-button:disabled {
      background: #aab8c2;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .feed-container {
        padding: 8px;
      }
      
      .feed-title {
        font-size: 20px;
      }
      
      .feed-subtitle {
        font-size: 14px;
      }
    }
  `]
})
export class FeedComponent implements OnInit, OnDestroy {
  @Input() posts: Post[] | null = null;
  @Input() loading = false;
  @Input() loadingMore = false;
  @Input() hasMore = false;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() emptyMessage?: string;

  @Output() postLike = new EventEmitter<string>();
  @Output() postRepost = new EventEmitter<string>();
  @Output() postComment = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByPostId(index: number, post: Post): string {
    return post.id;
  }

  onPostLike(postId: string): void {
    this.postLike.emit(postId);
  }

  onPostRepost(postId: string): void {
    this.postRepost.emit(postId);
  }

  onPostComment(postId: string): void {
    this.postComment.emit(postId);
  }

  onLoadMore(): void {
    this.loadMore.emit();
  }
}