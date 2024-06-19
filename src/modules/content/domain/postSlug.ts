
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Result } from "../../../shared/core/Result";
import slug from 'slug';

slug.defaults.mode ='pretty';
slug.defaults.modes['pretty'] = {
  replacement: '-',               // replace spaces with replacement 
  symbols: false,                 // replace unicode symbols or not 
  lower: true,                    // result in lower case 
  charmap: slug.charmap,          // replace special characters 
  multicharmap: slug.multicharmap // replace multi-characters 
};

export interface PostSlugProps {
  value: string;
}

export class PostSlug extends ValueObject<PostSlugProps> {

  get value (): string {
    return this.props.value;
  }

  private constructor (props: PostSlugProps) {
    super(props)
  }

  public static createFromExisting (slugName: string) {
    if (!!slugName === true) {
      return Result.ok<PostSlug>(new PostSlug({ value: slugName }));
    } else {
      return Result.fail<PostSlug>('No slug passed in')
    }
  }

  public static create (input: string): Result<PostSlug> {

  const isPostId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input);

  if (isPostId) {
    return Result.ok<PostSlug>(new PostSlug({ value: input }));
  } else {
    // Extract the first 5 words for post text
    const words = input.split(/\s+/); // Split on whitespace
    const title = words.slice(0, Math.min(words.length, 5)).join(' ');

    const timestamp = new Date().toISOString();
    const returnSlug = slug(title) + "-" + timestamp;
    return Result.ok<PostSlug>(new PostSlug({ value: returnSlug }));
  }
  }
}