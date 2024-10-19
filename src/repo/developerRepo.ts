import bcrypt from "bcrypt";

import { UserModel, userDataType } from "../model/user";
import { HttpStatus } from "../helper/config/httpStatus";
import { generateToken } from "../helper/utils/auth";
import { logError } from "../helper/utils/logError";
import IDeveloperRepo from "./types/developerTypes";
import { developerCreateType } from "../request/request";
import { DeveloperModel } from "../model/developer";

class DeveloperRepo implements IDeveloperRepo {
  async createDeveloper(
    formData: developerCreateType
  ): Promise<[boolean, Error | null, number]> {
    try {
      const { name, email, password, phone, avatar, logo } = formData;

      if (!email || !password)
        return [
          false,
          new Error("Email or Password missing from request"),
          HttpStatus.HTTP_NO_CONTENT,
        ];

      const existingUser = await UserModel.findOne({ "email.address": email });

      if (!existingUser)
        return [false, new Error("User not exist"), HttpStatus.HTTP_NOT_FOUND];

      const saltRounds = parseInt(process.env.SALT_ROUND as string, 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const { _id: userId } = await UserModel.create({
        name,
        "email.address": email,
        hashedPassword,
        phone,
        avatar,
      });

      await DeveloperModel.create({ userId, logo });

      return [true, null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      logError(error);
      return [
        false,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }
}

export { IDeveloperRepo, DeveloperRepo };
