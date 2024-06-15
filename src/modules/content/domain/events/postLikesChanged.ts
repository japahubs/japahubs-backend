
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Streams, Subjects } from "../../../../shared/nats";
import { Post } from "../post";

interface UserProps {
  id: UniqueEntityID;
  firstName: string;
  lastName: string;
  username?: string;
}

export class PostLiked implements IDomainEvent {
  public stream:Streams = Streams.Post;
  public subject:Subjects = Subjects.PostLiked;
  public dateTimeOccurred: Date;
  public post: Post;
  public data: any;

  constructor(post: Post, user: UserProps) {
    this.dateTimeOccurred = new Date();
    this.post = post;

    const postdata: any = {
      id: this.post.id.toString(),
      authorId: this.post.authorId.toString(),
      slug: this.post.slug,
      totalNumComments: this.post.totalNumComments,
      likes: this.post.totalNumLikes,
      dateTimePosted: this.post.createdAt.toISOString(),
    }

    if (this.post.caption) postdata.caption = this.post.caption
    if (this.post.link) postdata.links = this.post.link
    if (this.post.images) postdata.images = this.post.images

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
