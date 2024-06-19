import { faker } from '@faker-js/faker';
import { CreatePostDTO } from 'src/modules/posts/useCases/createPost/CreatePostDTO';

export class PostBuilder {
  private props: CreatePostDTO;

  constructor() {
    this.props = {
      userEmail: '',
      title: '',
      caption: '',
      imageUrl: '',
    };
  }

  public withUserEmail(userEmail: string) {
    this.props.userEmail = userEmail;
    return this;
  }
  withTitle(value: string) {
    this.props.title = value;
    return this;
  }
  withCaption(value: string) {
    this.props.caption = value;
    return this;
  }
  withImageUrl(value: string) {
    this.props.imageUrl = value;
    return this;
  }
  withRandomUserEmail() {
    this.props.userEmail = faker.internet.email();
    return this;
  }
  withRandomTitle() {
    this.props.title = faker.lorem.sentence();
    return this;
  }
  withRandomCaption() {
    this.props.caption = faker.lorem.paragraphs({
      min: 3,
      max: 10,
    });
    return this;
  }
  withRandomImageUrl() {
    this.props.imageUrl = faker.image.url();
    return this;
  }

  withRandomValues() {
    return this.withRandomUserEmail().withRandomTitle().withRandomCaption().withRandomImageUrl();
  }

  build() {
    return this.props;
  }
}
