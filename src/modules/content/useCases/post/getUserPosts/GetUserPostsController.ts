
import { BaseController } from "../../../../../shared/infra/http/models/BaseController";
import { GetUserPostsRequestDTO } from "./GetUserPostsRequestDTO";
import { GetUserPosts } from "./GetUserPosts";
import { GetUserPostsResponseDTO } from "./GetUserPostsResponseDTO";
import { DecodedExpressRequest } from "../../../../../shared";
import { PostMap } from "../../../mappers/postMap";


export class GetUserPostsController extends BaseController {
  private useCase: GetUserPosts;

  constructor (useCase: GetUserPosts) {
    super();
    this.useCase = useCase;
  }

  async executeImpl (req: DecodedExpressRequest, res: any): Promise<any> {

    const dto = req.body as GetUserPostsRequestDTO;
    const { userId } = req.query;
    dto.userId = userId as string

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
  
        switch (error.constructor) {
          default:
            return this.fail(res, error.getErrorValue().message);
        }
        
      } else {
        const results = result.value.getValue();
        return this.ok<GetUserPostsResponseDTO>(res, {
          posts: results.map((d) => PostMap.toDTO(d))
        });
      }

    } catch (err) {
      return this.fail(res, err)
    }
  }
}