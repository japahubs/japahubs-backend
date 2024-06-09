import { Post } from "../domain/post";

export interface IPostRepo {
  save(post:Post):Promise<void>
}
