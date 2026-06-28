export interface PostsResponse {
  posts: PostModel[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostModel {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions;
  views?: number;
  userId: number;
}

export interface PostReactions {
  likes: number;
  dislikes: number;
}