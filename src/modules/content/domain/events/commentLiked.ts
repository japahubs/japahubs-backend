import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { Post } from "../post";
import { Streams, Subjects } from "../../../../shared/nats";

interface CommentProps {
  id: UniqueEntityID,
  authorId: UniqueEntityID,
  text: string;
  contentId: UniqueEntityID,
  parentCommentId?: UniqueEntityID,
  likes?: number;
  contentType:string,
};

interface UserProps {
    id: UniqueEntityID;
    firstName: string;
    lastName: string;
    username?: string;
  }

export class CommentLiked implements IDomainEvent {
  public stream:Streams = Streams.Comment;
  public subject:Subjects = Subjects.CommentLiked;
  public dateTimeOccurred: Date;
  public post: Post;
  public comment: CommentProps;
  public data: any;

  constructor(post: Post, comment: CommentProps, user: UserProps) {
    this.dateTimeOccurred = new Date();
    this.post = post;
    this.comment = comment;

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
