import bcrypt from "bcrypt";
import { HttpStatus } from "../helper/config/httpStatus";
import { UserModel} from "../model/user";
import IUserRepo from "./types/userTypes";
import { logError } from "../helper/utils/logError";
import { userCreateType } from "../request/request";

class UserRepo implements IUserRepo {
  async createUser(
    userData: userCreateType
  ): Promise<[boolean, Error | null, number]> {
    try {
      const { email, password, name } = userData;

      if (!email || !password || !name)
        return [
          false,
          new Error("Email,Name or Password missing from request"),
          HttpStatus.HTTP_NO_CONTENT,
        ];

      const existingUser = await UserModel.findOne({ email });

      if (existingUser)
        return [
          false,
          new Error("User already exist"),
          HttpStatus.HTTP_BAD_REQUEST,
        ];

      const saltRounds = parseInt(process.env.SALT_ROUND as string, 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await UserModel.create({
        name,
        email: { address: email },
        hashedPassword,
      });

      if (result) {
        return [true, null, HttpStatus.HTTP_SUCCESS];
      } else {
        return [true, null, HttpStatus.HTTP_BAD_REQUEST];
      }
    } catch (error) {
      logError(error);
      return [
        true,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }
}

export { IUserRepo, UserRepo };
