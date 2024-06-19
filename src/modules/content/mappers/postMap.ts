
import { Mapper } from "../../../shared/infra/Mapper";
import { Post, PostProps } from "../domain/post";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { PostSlug } from "../domain/postSlug";
import { PostLink } from "../domain/postLink";
import { PostDTO } from "../dtos/postDTO";
import { AuthorId } from "../domain/authorId";
import { ContentText } from "../domain/contentText";
import { PostImage } from "../domain/postImage";

export class PostMap implements Mapper<Post> {

  public static toDTO (post: Post): PostDTO {
    return {
      id: post.postId.getStringValue(),
      authorId: post.authorId.getStringValue(),
      slug: post.slug ? post.slug.value : "",
      caption: post.caption ? post.caption.value : "",
      link: post.link ? post.link.url : "",
      images: post.images ? post.images.map(image => image.url) : [],
      totalNumViews:  post.totalNumViews ? post.totalNumViews : 0,
      totalNumLikes: post.totalNumLikes ? post.totalNumLikes : 0,
      totalNumComments: post.totalNumComments ? post.totalNumComments : 0,
      createdAt: post.createdAt.toISOString()
    }
  } 

  public static toDomain (raw: any): Post {
    const authorIdOrError = AuthorId.create(new UniqueEntityID(raw.userId));
    const totalNumViews = raw.totalNumViews;
    const totalNumLikes = raw.totalNumLikes;
    const totalNumComments = raw.totalNumComments;
    const createdAt = raw.created_at

    const postValues: PostProps = {
      authorId: authorIdOrError.getValue(),
      totalNumViews,
      totalNumLikes,
      totalNumComments,
      createdAt,
    };

    if (raw.slug) postValues.slug = PostSlug.createFromExisting(raw.slug).getValue();
    if (raw.caption) postValues.caption = ContentText.create({value: raw.caption}).getValue();
    if (raw.link) postValues.link = PostLink.create({url: raw.link}).getValue();
    if (raw.images) postValues.images = raw.images.map((image:string) => PostImage.create({url: image}).getValue());
  
    const postOrError = Post.create(postValues,new UniqueEntityID(raw.id));
    postOrError.isFailure ? console.log(postOrError.getErrorValue()) : '';

    return postOrError.getValue();
  }

  public static toPersistence (post: Post): any {
    const raw: any =  {
      id: post.postId.getStringValue(),
      totalNumViews: post.totalNumViews || 0,
      totalNumLikes: post.totalNumLikes || 0,
      totalNumComments: post.totalNumComments || 0,
      created_at: post.createdAt
    }

    if (post.slug) raw.slug = post.slug.value;
    if (post.images) raw.images = post.images.map(image => image.url);
    if (post.caption) raw.caption = post.caption.value;
    if (post.link) raw.link = post.link.url;

    return raw;
  }
}