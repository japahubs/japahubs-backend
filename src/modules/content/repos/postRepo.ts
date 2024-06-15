import { Post } from "../domain/post";
import { ContentId } from "../domain/contentId";

export interface IPostRepo {
  getPostByPostId (postId: ContentId | string): Promise<Post>;
  getPostBySlug (slug: string): Promise<Post>;
  getUserPosts (userId: string,page?: number, limit?: number): Promise<Post[]>;
  getPopularPosts (page?: number, limit?: number): Promise<Post[]>;
  exists (postId: ContentId): Promise<boolean>;
  save (post: Post): Promise<void>;
  delete (postId: ContentId): Promise<void>;
}
