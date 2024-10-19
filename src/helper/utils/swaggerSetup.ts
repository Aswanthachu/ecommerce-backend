import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../../../swagger.json";

class swaggerSetup {
  public static init(app: Application): void {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
export default swaggerSetup;
