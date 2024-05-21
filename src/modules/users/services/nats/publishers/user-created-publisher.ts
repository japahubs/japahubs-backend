import {
  Publisher,
  Streams,
  Subjects,
  UserCreatedEvent,
} from "../../../../../shared/nats";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  stream: Streams.User = Streams.User;
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
