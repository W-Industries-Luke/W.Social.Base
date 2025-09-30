import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedComponent } from './feed.component';
import { Post } from '../models/post.interface';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;

  const mockPosts: Post[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'John Doe',
      content: 'First post',
      timestamp: new Date('2024-01-01T12:00:00Z'),
      likes: 5,
      reposts: 2,
      comments: 3
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Jane Smith',
      content: 'Second post',
      timestamp: new Date('2024-01-01T13:00:00Z'),
      likes: 8,
      reposts: 1,
      comments: 5
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display posts when provided', () => {
    component.posts = mockPosts;
    fixture.detectChanges();
    
    const postElements = fixture.nativeElement.querySelectorAll('wsb-post');
    expect(postElements.length).toBe(2);
  });

  it('should show loading state', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.nativeElement.querySelector('.feed-loading');
    expect(loadingElement).toBeTruthy();
    expect(loadingElement.textContent).toContain('Loading posts...');
  });

  it('should show empty state when no posts', () => {
    component.posts = [];
    component.loading = false;
    fixture.detectChanges();
    
    const emptyElement = fixture.nativeElement.querySelector('.feed-empty');
    expect(emptyElement).toBeTruthy();
    expect(emptyElement.textContent).toContain('No posts yet');
  });

  it('should display title and subtitle when provided', () => {
    component.title = 'My Feed';
    component.subtitle = 'Latest updates';
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('.feed-title');
    const subtitleElement = fixture.nativeElement.querySelector('.feed-subtitle');
    
    expect(titleElement.textContent).toContain('My Feed');
    expect(subtitleElement.textContent).toContain('Latest updates');
  });

  it('should emit loadMore event when load more button is clicked', () => {
    spyOn(component.loadMore, 'emit');
    component.hasMore = true;
    component.loading = false;
    fixture.detectChanges();
    
    const loadMoreButton = fixture.nativeElement.querySelector('.load-more-button');
    expect(loadMoreButton).toBeTruthy();
    
    loadMoreButton.click();
    expect(component.loadMore.emit).toHaveBeenCalled();
  });

  it('should emit post interaction events', () => {
    spyOn(component.postLike, 'emit');
    spyOn(component.postRepost, 'emit');
    spyOn(component.postComment, 'emit');
    
    component.onPostLike('post1');
    component.onPostRepost('post2');
    component.onPostComment('post3');
    
    expect(component.postLike.emit).toHaveBeenCalledWith('post1');
    expect(component.postRepost.emit).toHaveBeenCalledWith('post2');
    expect(component.postComment.emit).toHaveBeenCalledWith('post3');
  });
});