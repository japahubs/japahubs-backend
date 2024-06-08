// import * as express from "express";
// import { BaseController } from "../../../../shared/infra/http/models/BaseController";
// import { DecodedExpressRequest } from "../../../../shared";
// import { EditUserErrors } from "./EditUserErrors";
// import { EditUser } from "./EditUser";

// export interface EditUserDTO {
//     bio?: string;
//     avatar?: string;
//     phone?: string;
//     firstName?: string;
//     lastName?: string;
//     gender?: string;
//     country?: string;
//     language?: string;
//     links?: string[];
//   }

// export class EditUserController extends BaseController {
//   private useCase: EditUser;

//   constructor(useCase: EditUser) {
//     super();
//     this.useCase = useCase;
//   }

//   async executeImpl(
//     req: DecodedExpressRequest,
//     res: express.Response
//   ): Promise<any> {

//     const { userId } = req.decoded;
//     let dto: EditUserDTO = req.body as EditUserDTO;

//     try {
//       const result = await this.useCase.execute({userId, ...dto});
    
//       if (result.isLeft()) {
//         const error = result.value;

//         switch (error.constructor) {
//           case EditUserErrors.UserNotFoundError:
//             return this.notFound(res, error.getErrorValue().message);
//           default:
//             console.log(error);
//             return this.fail(res, error.getErrorValue().message);
//         }
//       } else {
//         return this.ok(res);
//       }
//     } catch (err) {
//       return this.fail(res, err);
//     }
    
//   }
// }
