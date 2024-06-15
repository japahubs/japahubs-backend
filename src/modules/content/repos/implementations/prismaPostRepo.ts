import { PrismaClient } from "@prisma/client";
import { IPostRepo } from "../postRepo";
import { Post } from "../../domain/post";
import { ContentId } from "../../domain/contentId";
import { PostMap } from "../../mappers/postMap";
import { dispatchEventsCallback } from "../../../../shared/infra/persistence/hooks";


export class PrismaPostRepo implements IPostRepo {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  async getPostByPostId(postId: ContentId | string): Promise<Post> {
    const prismaPost = await this.prisma.posts.findFirst({
      where: {
        id: postId instanceof ContentId ? postId.getStringValue() : postId,
      },
    });
    if (!prismaPost) throw new Error("Post not found.");
    return PostMap.toDomain(prismaPost);
  }

  async getPostBySlug(slug: string): Promise<Post> {
    const prismaPost = await this.prisma.posts.findFirst({
      where: {
        slug,
      },
    });
    if (!prismaPost) throw new Error("Post not found.");
    return PostMap.toDomain( prismaPost);
  }

  async getRecentPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    const posts = await this.prisma.posts.findMany({
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * limit,
      take: 10,
    });
    return posts.map((post) => PostMap.toDomain(post));
  }

  async getPopularPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
    const posts = await this.prisma.posts.findMany({
      orderBy: {
              totalNumLikes: "desc",
            },
      skip: (page - 1) * limit,
      take: limit,
    });
    return posts.map((post) => PostMap.toDomain(post));
  }

  async exists(postId: ContentId): Promise<boolean> {
    const post = await this.prisma.posts.findFirst({
      where: {
        id: postId.getStringValue(),
      },
    });
    return !!post;
  }

  async save(post: Post): Promise<void> {
    const rawPost = await PostMap.toPersistence(post);
    const existingPost = await this.prisma.posts.findUnique({
      where: { id: rawPost.id },
    });
  
    if (existingPost) {
      await this.prisma.posts.update({
        where: { id: rawPost.id },
        data: rawPost,
      });
    } else {
      const result = await this.prisma.posts.create({
        data: {
          ...rawPost,
          user: { connect: { id: post.authorId.getStringValue() } },
        },
      });
      dispatchEventsCallback(result.id);
    }
  }
  

  async delete(postId: ContentId): Promise<void> {
    await this.prisma.posts.delete({
      where: {
        id: postId.getStringValue(),
      },
    });
  }
}
