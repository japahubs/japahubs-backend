
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import { GetAllUsersRequestDTO } from "./GetAllUsersRequestDTO";
import { GetAllUsers } from "./GetAllUsers";
import { GetAllUsersResponseDTO } from "./GetAllUsersResponseDTO";
import { UserDetailsMap } from "../../mappers/userDetailsMap";
import { DecodedExpressRequest } from "../../../../shared";

export class GetAllUsersController extends BaseController {
  private useCase: GetAllUsers;

  constructor (useCase: GetAllUsers) {
    super();
    this.useCase = useCase;
  }

  async executeImpl (req: DecodedExpressRequest, res: any): Promise<any> {

    const search = (req.query.search as string) || "";
    const { page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page as string);
    const parsedLimit = parseInt(limit as string);

    const dto: GetAllUsersRequestDTO = {
      search,
      page: parsedPage,
      limit: parsedLimit,
    }
    

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
  
        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }
        
      } else {
        const userDetails = result.value.getValue();
        return this.ok<GetAllUsersResponseDTO>(res, {
          users: userDetails.map((user) => UserDetailsMap.toDTO(user))
        });
      }

    } catch (err) {
      return this.fail(res, err)
    }
  }
}