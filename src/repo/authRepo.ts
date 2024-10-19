import bcrypt from "bcrypt";
import { HttpStatus } from "../helper/config/httpStatus";
import { UserModel } from "../model/user";
import IAuthRepo from "./types/authTypes";
import { logError } from "../helper/utils/logError";
import { userCreateType } from "../request/request";
import { generateToken } from "../helper/utils/auth";

class AuthRepo implements IAuthRepo {
  async login(
    loginData: userCreateType
  ): Promise<[any | null, string | undefined, Error | null, number]> {
    try {
      const { email, password } = loginData;

      if (!email || !password)
        return [
          null,
          undefined,
          new Error("Email,Name or Password missing from request"),
          HttpStatus.HTTP_NO_CONTENT,
        ];

      const existingUser = await UserModel.findOne({ "email.address":email });

      if (!existingUser)
        return [
          null,
          undefined,
          new Error("User not exist"),
          HttpStatus.HTTP_BAD_REQUEST,
        ];

      const validUser = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );

      if (validUser) {
        const userData = {
          id: existingUser._id,
          userType: existingUser.userType,
          email: existingUser.email.address,
          name: existingUser.name,
        };

        return [
          userData,
          generateToken(email, existingUser._id, existingUser.userType),
          null,
          HttpStatus.HTTP_SUCCESS,
        ];
      } else {
        return [null, undefined, null, HttpStatus.HTTP_BAD_REQUEST];
      }
    } catch (error) {
      logError(error);
      return [
        null,
        undefined,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }
}

export { IAuthRepo, AuthRepo };
