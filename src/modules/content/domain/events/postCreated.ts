
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Post } from "../post";
import { Streams, Subjects } from "../../../../shared/nats";

export class PostCreated implements IDomainEvent {
  public stream:Streams.Post = Streams.Post;
  public subject:Subjects = Subjects.PostCreated;
  public dateTimeOccurred: Date;
  public post: Post;
  public data: any;

  constructor(post: Post) {
    this.dateTimeOccurred = new Date();
    this.post = post;

    const postdata: any = {
      id: this.post.id.toString(),
      authorId: this.post.authorId.toString(),
      slug: this.post.slug,
      totalNumComments: this.post.totalNumComments,
      totalNumLikes: this.post.totalNumLikes,
      totalNumViews: this.post.totalNumViews,
      createdAt: this.post.createdAt.toISOString(),
      caption: this.post.caption || "",
      links: this.post.link || "",
      images: this.post.images ? this.post.images.map((image) => image.url) : []
    }

    this.data = {
      type: this.subject,
      timestamp: this.dateTimeOccurred.toISOString(),
      data: postdata,
    };
  }

  getAggregateId(): UniqueEntityID {
    return this.post.id;
  }
}
