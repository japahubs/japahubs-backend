
import { Entity } from "../../../shared/domain/Entity";
import { Result } from "../../../shared/core/Result";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { CommentId } from "./commentId";
import { CommentText } from "./commentText";
import { AuthorId } from "./authorId";
import { Guard } from "../../../shared/core/Guard";
import { ContentId } from "./contentId";
import { has } from 'lodash'

export interface CommentProps {
  authorId: AuthorId;
  text: CommentText;
  contentId: ContentId;
  parentCommentId?: CommentId;
  likes?: number;
}

export class Comment extends Entity<CommentProps> {

  get commentId (): CommentId {
    return CommentId.create(this._id)
      .getValue();
  }

  get contentId (): ContentId {
    return this.props.contentId;
  }

  get parentCommentId (): CommentId {
    return this.props.parentCommentId;
  }

  get authorId (): AuthorId {
    return this.props.authorId;
  }

  get text (): CommentText {
    return this.props.text;
  }

  get likes (): number {
    return this.props.likes;
  }

  private constructor (props: CommentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create (props: CommentProps, id?: UniqueEntityID): Result<Comment> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.authorId, argumentName: 'authorId' },
      { argument: props.text, argumentName: 'text' },
      { argument: props.contentId, argumentName: 'contentId' },
    ]);

    if (nullGuard.isFailure) {
      return Result.fail<Comment>(nullGuard.getErrorValue());
    } else {

      const isNewComment = !!id === false;

      const defaultCommentProps: CommentProps = {
        ...props,
        likes: has(props, 'likes') ? props.likes : 0,
      }

      const comment = new Comment(defaultCommentProps, id);

      if (isNewComment) {
    
      }

      return Result.ok<Comment>(comment);
    }
  }
}