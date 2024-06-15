import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Result, left, right } from "../../../shared/core/Result";
import { PostSlug } from "./postSlug";
import { ContentId } from "./contentId";
import { ContentText } from "./contentText";
import { Comment } from "./comment";
import { Guard, IGuardArgument } from "../../../shared/core/Guard";
import { PostCreated } from "./events/postCreated";
import { PostLink } from "./postLink";
import { CommentPosted } from "../../../shared/nats/events/content/comment-posted";
import { Comments } from "./comments";
import { CommentLiked } from "../../../shared/nats/events/content/comment-likes-changed";
import { PostLiked } from "../../../shared/nats/events/content/post-likes-changed";
import { AuthorId } from './authorId';
import { PostImage } from './postImage';

export interface PostProps {
  authorId: AuthorId;
  slug?: PostSlug;
  caption?: ContentText;
  link?: PostLink;
  images?: PostImage[];
  totalNumViews?: number;
  totalNumLikes?: number;
  totalNumComments?: number;
  createdAt: Date;
};

export class Post extends AggregateRoot<PostProps> {

  get postId () {
    return ContentId.create(this._id)
      .getValue();
  }

  get authorId () {
    return this.props.authorId;
  }

  get slug () {
    return this.props.slug;
  }

  setSlug(slug: PostSlug): void {
    this.props.slug = slug;
  }

  get createdAt () {
    return this.props.createdAt;
  }

  get link () {
    return this.props.link;
  }

  get caption () {
    return this.props.caption;
  }

  get images () {
    return this.props.images;
  }

  get totalNumViews () {
    return this.props.totalNumViews;
  }

  get totalNumLikes () {
    return this.props.totalNumLikes;
  }

  get totalNumComments () {
    return this.props.totalNumComments;
  }

  public updateComments (numComments: number /** , comment: Comment */): void {
    if (numComments >= 0) {
      this.props.totalNumComments = numComments;
    }
    // if (comment) this.addDomainEvent(new CommentPosted(this, comment));
  }

  public updateLikes (numLikes: number /** , like?: PostLike */): void {
    if (numLikes >= 0) {
      this.props.totalNumLikes = numLikes;
    }
    // if (like) this.addDomainEvent(new PostLiked(this, like));
  }

  public hasComments (): boolean {
    return this.totalNumComments !== 0;
  }

  public updateCaption (caption: ContentText) {
    const guardResult = Guard.againstNullOrUndefined(caption, 'caption');
    if (guardResult.isFailure) {
      return left(Result.fail<any>(guardResult.getErrorValue()))
    } 
    this.props.caption = caption;
    return right(Result.ok<void>());
  }

  public updateLink (link: PostLink) {
    const guardResult = Guard.againstNullOrUndefined(link, 'link');
    if (guardResult.isFailure) {
      return left(Result.fail<any>(guardResult.getErrorValue()))
    } 
    this.props.link = link;
    return right(Result.ok<void>());
  }

  public updateImages (images: PostImage[] ) {
    const guardResult = Guard.againstNullOrUndefined(images, 'images');
    if (guardResult.isFailure) {
      return left(Result.fail<any>(guardResult.getErrorValue()))
    } 
    this.props.images = images;
    return right(Result.ok<void>());
  }


  private constructor (props: PostProps, id?: UniqueEntityID) {
    super(props, id);
  }

 
  public static create (props: PostProps, id?: UniqueEntityID): Result<Post> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.authorId, argumentName: 'authorId' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<Post>(guardResult.getErrorValue());
    }


    const defaultValues: PostProps = {
      ...props,
      totalNumViews: props.totalNumViews ? props.totalNumViews : 0,
      totalNumLikes: props.totalNumLikes ? props.totalNumLikes : 0,
      totalNumComments: props.totalNumComments ? props.totalNumComments : 0,
    };

    const isNewPost = !!id === false;
    const post = new Post(defaultValues, id);
    if (!props.slug) post.setSlug(PostSlug.create(post.authorId.getStringValue()).getValue());

    if (isNewPost) {
      post.addDomainEvent(new PostCreated(post));

    }

    return Result.ok<Post>(post);
  }
}