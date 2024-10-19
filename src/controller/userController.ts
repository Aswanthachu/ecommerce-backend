import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { HttpStatus } from "../helper/config/httpStatus";
import { UserRepo, IUserRepo } from "../repo/userRepo";
import { logError } from "../helper/utils/logError";
import { JSONSchemaType } from "ajv";
import validate from "../helper/validation/validate";
import * as validationSchema from "../request/request";

const userRepo: IUserRepo = new UserRepo();

@Route("api/user")
@Tags("User")
// @Security("jwt")
class UserController extends Controller {
  @Post()
  @Example({
    email: "example@gmail.com",
    password: "Example@123",
    name: "John Doe",
  })
  @Middlewares(validate(validationSchema.userPostSchema as JSONSchemaType<any>))
  public async createUser(
    @Body() userData: validationSchema.userCreateType
  ): Promise<{ data?: any; error?: string }> {
    try {
      const [newUser, error, httpStatus] = await userRepo.createUser(userData);

      if (error) {
        this.setStatus(httpStatus);
        return { error: error.message };
      }
      this.setStatus(httpStatus);
      return { data: newUser || [] };
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
      logError(error);
      return {
        error: error as string,
      };
    }
  }
}

export { UserController };
