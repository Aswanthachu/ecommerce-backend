import { Controller, Route, Body, Tags, Example, Post, Middlewares } from "tsoa";
import { HttpStatus } from "../helper/config/httpStatus";
import { DeveloperRepo, IDeveloperRepo } from "../repo/developerRepo";
import { logError } from "../helper/utils/logError";
import { developerCreateType } from "../request/request";
import validate from "../helper/validation/validate";
import { JSONSchemaType } from "ajv";
import * as validationSchema from "../request/request";


const developerRepo: IDeveloperRepo = new DeveloperRepo();

@Route("api/developer")
@Tags("Developer")
class DeveloperController extends Controller {
  @Post("create-developer")
  @Example({
    name: "Developer 1",
    email: "example@gmail.com",
    password: "Example@123",
    phone: "8589949567",
    avatar: "https://i.pravatar.cc/300",
    logo: "https://i.pravatar.cc/800",
    userType: "developer",
  })
  @Middlewares(validate(validationSchema.developerPostSchema as JSONSchemaType<any>))
  public async createDeveloper(
    @Body() formData: any
  ): Promise<{ data?: any; error?: string }> {
    try {
      console.log("hiii",formData);
      
      const [response, error, httpStatus] = await developerRepo.createDeveloper(
        formData
      );

      if (error) {
        this.setStatus(httpStatus);
        return { error: error.message };
      }
      this.setStatus(httpStatus);
      return { data: response };
    } catch (error) {
      console.log("hiii");
      
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
      logError(error);
      return {
        error: error as string,
      };
    }
  }
}

export { DeveloperController };
