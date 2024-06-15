import { PostCreated } from "../../../domain/events/postCreated";
import {
  Publisher,
  Streams,
  Subjects,
} from "../../../../../shared/nats";

export class PostCreatedPublisher extends Publisher<PostCreated> {
  stream: Streams.Post = Streams.Post;
  subject: Subjects.PostCreated = Subjects.PostCreated;
}
