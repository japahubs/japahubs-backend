import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { PostCaption } from './postCaption';
import { PostTitle } from './postTitle';

type PostProps = {
  title: PostTitle;
  caption: PostCaption;
};

export class Post extends AggregateRoot<PostProps> {
  static create(props: PostProps, id?: UniqueEntityID): Post {
    return new Post(props, id);
  }
}
