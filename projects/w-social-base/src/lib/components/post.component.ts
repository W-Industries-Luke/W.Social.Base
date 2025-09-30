import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, PostInteraction } from '../models/post.interface';

@Component({
  selector: 'wsb-post',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="post-container" [attr.data-post-id]="post?.id">
      <div class="post-header">
        <img 
          [src]="post?.authorProfilePic || defaultAvatar" 
          [alt]="post?.authorName + ' profile picture'"
          class="author-avatar"
        />
        <div class="author-info">
          <h3 class="author-name">{{ post?.authorName }}</h3>
          <span class="post-timestamp">{{ formatTimestamp(post?.timestamp) }}</span>
        </div>
      </div>
      
      <div class="post-content">
        <p class="post-text">{{ post?.content }}</p>
        <div *ngIf="post?.mediaUrl && post?.type === 'image'" class="post-media">
          <img [src]="post!.mediaUrl" [alt]="'Media from ' + post!.authorName" class="post-image" />
        </div>
        <div *ngIf="post?.mediaUrl && post?.type === 'video'" class="post-media">
          <video [src]="post!.mediaUrl" controls class="post-video"></video>
        </div>
      </div>
      
      <div class="post-actions">
        <button 
          class="action-button like-button"
          [class.active]="post?.isLiked"
          (click)="onLike()"
          [attr.aria-label]="'Like post by ' + post?.authorName"
        >
          <span class="action-icon">♥</span>
          <span class="action-count">{{ post?.likes || 0 }}</span>
        </button>
        
        <button 
          class="action-button repost-button"
          [class.active]="post?.isReposted"
          (click)="onRepost()"
          [attr.aria-label]="'Repost by ' + post?.authorName"
        >
          <span class="action-icon">⟲</span>
          <span class="action-count">{{ post?.reposts || 0 }}</span>
        </button>
        
        <button 
          class="action-button comment-button"
          (click)="onComment()"
          [attr.aria-label]="'View comments on post by ' + post?.authorName"
        >
          <span class="action-icon">💬</span>
          <span class="action-count">{{ post?.comments || 0 }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .post-container {
      border: 1px solid #e1e8ed;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      background: white;
      transition: box-shadow 0.2s ease;
    }
    
    .post-container:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .post-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 12px;
      object-fit: cover;
    }
    
    .author-info {
      flex: 1;
    }
    
    .author-name {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #14171a;
    }
    
    .post-timestamp {
      font-size: 14px;
      color: #657786;
    }
    
    .post-content {
      margin-bottom: 16px;
    }
    
    .post-text {
      margin: 0 0 12px 0;
      font-size: 15px;
      line-height: 1.4;
      color: #14171a;
    }
    
    .post-media {
      margin-top: 12px;
    }
    
    .post-image, .post-video {
      max-width: 100%;
      border-radius: 8px;
    }
    
    .post-actions {
      display: flex;
      justify-content: space-around;
      padding-top: 12px;
      border-top: 1px solid #e1e8ed;
    }
    
    .action-button {
      display: flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 14px;
      color: #657786;
    }
    
    .action-button:hover {
      background-color: #f7f9fa;
    }
    
    .action-button.active {
      color: #1da1f2;
    }
    
    .like-button.active {
      color: #e0245e;
    }
    
    .repost-button.active {
      color: #17bf63;
    }
    
    .action-icon {
      font-size: 16px;
    }
    
    .action-count {
      font-weight: 500;
    }
  `]
})
export class PostComponent implements OnInit {
  @Input() post: Post | null = null;
  @Output() like = new EventEmitter<string>();
  @Output() repost = new EventEmitter<string>();
  @Output() comment = new EventEmitter<string>();

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNlMWU4ZWQiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0iIzY1Nzc4NiIvPgo8cGF0aCBkPSJNMzIgMzJjMC02LjYyNy01LjM3My0xMi0xMi0xMnMtMTIgNS4zNzMtMTIgMTIiIGZpbGw9IiM2NTc3ODYiLz4KPC9zdmc+';

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  onLike(): void {
    if (this.post?.id) {
      this.like.emit(this.post.id);
    }
  }

  onRepost(): void {
    if (this.post?.id) {
      this.repost.emit(this.post.id);
    }
  }

  onComment(): void {
    if (this.post?.id) {
      this.comment.emit(this.post.id);
    }
  }

  formatTimestamp(timestamp: Date | undefined): string {
    if (!timestamp) return '';
    
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMs = now.getTime() - postTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d`;
    } else {
      return postTime.toLocaleDateString();
    }
  }
}