import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { Post } from '../models/post.interface';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  const mockPost: Post = {
    id: '1',
    authorId: 'user1',
    authorName: 'John Doe',
    content: 'This is a test post',
    timestamp: new Date('2024-01-01T12:00:00Z'),
    likes: 5,
    reposts: 2,
    comments: 3,
    isLiked: false,
    isReposted: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.post = mockPost;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display post content', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.post-text').textContent).toContain('This is a test post');
    expect(compiled.querySelector('.author-name').textContent).toContain('John Doe');
  });

  it('should emit like event when like button is clicked', () => {
    spyOn(component.like, 'emit');
    const likeButton = fixture.nativeElement.querySelector('.like-button');
    likeButton.click();
    expect(component.like.emit).toHaveBeenCalledWith('1');
  });

  it('should emit repost event when repost button is clicked', () => {
    spyOn(component.repost, 'emit');
    const repostButton = fixture.nativeElement.querySelector('.repost-button');
    repostButton.click();
    expect(component.repost.emit).toHaveBeenCalledWith('1');
  });

  it('should emit comment event when comment button is clicked', () => {
    spyOn(component.comment, 'emit');
    const commentButton = fixture.nativeElement.querySelector('.comment-button');
    commentButton.click();
    expect(component.comment.emit).toHaveBeenCalledWith('1');
  });

  it('should format timestamp correctly', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    expect(component.formatTimestamp(fiveMinutesAgo)).toBe('5m');
    expect(component.formatTimestamp(undefined)).toBe('');
  });
});