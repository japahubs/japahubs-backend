import { faker } from '@faker-js/faker';
import { CreatePostDTO } from "../../../../modules/content/useCases/post/createPost/CreatePostDTO";
import { UniqueEntityID } from '../../../domain/UniqueEntityID';

export class PostBuilder {
  private props: CreatePostDTO;

  constructor() {
    this.props = {
      userId: '',
      link: '',
      caption: '',
      images: [],
    };
  }

  public withUserId( userId:string) {
    this.props.userId = userId;
    return this;
  }
  withLink(value: string) {
    this.props.link = value;
    return this;
  }
  withCaption(value: string) {
    this.props.caption = value;
    return this;
  }
  withImage(value: string) {
    this.props.images.push(value);
    return this;
  }
  public withRandomUserId() {
    this.props.userId = new UniqueEntityID().toString();
    return this;
  }
  withRandomLink() {
    this.props.link = "https://info.japahub.com"
    return this;
  }
  withRandomCaption() {
    this.props.caption = faker.lorem.paragraphs({
      min: 3,
      max: 10,
    });
    return this;
  }
  withRandomImage() {
    this.props.images.push("https://media.tacdn.com/media/attractions-content--1x-1/10/61/ec/91.jpg");
    return this;
  }

  withRandomValues() {
    return this.withRandomUserId().withRandomLink().withRandomCaption().withRandomImage();
  }

  build() {
    return this.props;
  }
}
