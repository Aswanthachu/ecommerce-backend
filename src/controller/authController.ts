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
import { AuthRepo, IAuthRepo } from "../repo/authRepo";
import { logError } from "../helper/utils/logError";
import { JSONSchemaType } from "ajv";
import validate from "../helper/validation/validate";
import * as validationSchema from "../request/request";

const authRepo: IAuthRepo = new AuthRepo();

@Route("api/auth")
@Tags("Auth")
class AuthController extends Controller {
  @Post()
  @Example({
    email: "example@gmail.com",
    password: "Example@123",
  })
  @Middlewares(validate(validationSchema.authPostSchema as JSONSchemaType<any>))
  public async login(
    @Body() loginData: validationSchema.loginDataType
  ): Promise<{ data?: any; token?: string; error?: string }> {
    try {
      const [user, token, error, httpStatus] = await authRepo.login(loginData);

      if (error) {
        this.setStatus(httpStatus);
        return { error: error.message };
      }
      this.setStatus(httpStatus);
      return { data: user || [], token };
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
      logError(error);
      return {
        error: error as string,
      };
    }
  }

  @Post("signup")
  @Example({
    email: "example@gmail.com",
    password: "Example@123",
  })
  @Middlewares(validate(validationSchema.signupPostSchema as JSONSchemaType<any>))
  public async signup(
    @Body() signupData: validationSchema.signupDataType
  ): Promise<{ data?: any; token?: string; error?: string }> {
    try {
      console.log(signupData);
      const [user, token, error, httpStatus] = await authRepo.signup(signupData);      

      if (error) {
        this.setStatus(httpStatus);
        return { error: error.message };
      }
      this.setStatus(httpStatus);
      return { data: user || [], token };
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
      logError(error);
      return {
        error: error as string,
      };
    }
  }
}

export { AuthController };
