import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";
interface CountryProps {
  value: string;
}

export class Country extends ValueObject<CountryProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: CountryProps) {
    super(props);
  }

  public static create(props: CountryProps): Result<Country> {
    const nullGuard = Guard.againstNullOrUndefined(props.value, "country");

    if (nullGuard.isFailure) {
      return Result.fail<Country>(nullGuard.getErrorValue());
    }

    return Result.ok<Country>(new Country(props));
  }
}
