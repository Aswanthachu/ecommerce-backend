// import {
//   Body,
//   Controller,
//   Delete,
//   Example,
//   Get,
//   Middlewares,
//   Path,
//   Post,
//   Put,
//   Route,
//   Security,
//   Tags,
// } from "tsoa";

// import { HttpStatus } from "../helper/config/httpStatus";
// import { IProjectRepo, ProjectRepo } from "../repo/projectRepo";
// import { logError } from "../helper/utils/logError";
// import { JSONSchemaType } from "ajv";
// import validate from "../helper/validation/validate";
// import * as validationSchema from "../request/request";
// import { projectType } from "../model/projects";
// import { Types } from "mongoose";

// const projectRepo: IProjectRepo = new ProjectRepo();
// const example = {
//   name: "Project 1",
//   display_name: "Project 1 Display",
//   client_id: new Types.ObjectId("6036f9b4d53f9e24c4e94964"),
//   location_id: new Types.ObjectId("6036f9b4d53f9e24c4e94964"),
// };

// @Route("api/project")
// @Tags("Project")
// @Security("jwt")
// class ProjectController extends Controller {
//   @Post()
//   @Example(example)
//   @Middlewares(
//     validate(validationSchema.projectPostSchema as JSONSchemaType<any>)
//   )
//   public async addProject(
//     @Body() projectData: projectType
//   ): Promise<{ data?: any; error?: string }> {
//     try {
//       const [response, error, httpStatus] = await projectRepo.addProject(
//         projectData
//       );

//       if (error) {
//         this.setStatus(httpStatus);
//         return { error: error.message };
//       }
//       this.setStatus(httpStatus);
//       return { data: response || [] };
//     } catch (error) {
//       this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR);
//       logError(error);
//       return {
//         error: error as string,
//       };
//     }
//   }
// }

// export { ProjectController };
