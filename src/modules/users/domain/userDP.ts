import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { TextUtils } from "../../../shared/utils/TextUtils";

interface UserDPProps {
  url: string;
}

export class UserDP extends ValueObject<UserDPProps> {
  private static readonly ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];

  get url(): string {
    return this.props.url;
  }

  private constructor(props: UserDPProps) {
    super(props);
  }

  public static create(props: UserDPProps): Result<UserDP> {
    if (!TextUtils.validateWebURL(props.url)) {
      return Result.fail<UserDP>("Invalid URL format.");
    }

    if (!this.isValidExtension(props.url)) {
      return Result.fail<UserDP>("Invalid file extension.");
    }

    /* 
    Other possible checks: 
    If the url is publicly accessible
    Does not contian harmful JavaScript code
    Confirm that the resource exists
    */

    return Result.ok<UserDP>(new UserDP(props));
  }

  private static isValidExtension(url: string): boolean {
    const extension = url.split(".").pop()?.toLowerCase();
    return !!extension && this.ALLOWED_EXTENSIONS.includes(extension);
  }
}
