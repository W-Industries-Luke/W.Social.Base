export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePic?: string;
  content: string;
  timestamp: Date;
  likes: number;
  reposts: number;
  comments: number;
  isLiked?: boolean;
  isReposted?: boolean;
  type?: 'text' | 'image' | 'video';
  mediaUrl?: string;
}

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'repost' | 'comment';
  timestamp: Date;
}

export interface PostStats {
  likes: number;
  reposts: number;
  comments: number;
}