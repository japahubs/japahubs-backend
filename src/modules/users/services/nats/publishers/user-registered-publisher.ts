import {
  Publisher,
  Streams,
  Subjects,
  UserRegisteredEvent,
} from "../../../../../shared/nats";

export class UserRegisteredPublisher extends Publisher<UserRegisteredEvent> {
  stream: Streams.User = Streams.User;
  subject: Subjects.UserRegistered = Subjects.UserRegistered;
}
