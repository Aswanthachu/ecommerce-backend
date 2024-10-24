import bcrypt from "bcrypt";
import { HttpStatus } from "../helper/config/httpStatus";
import { UserModel } from "../model/user";
import IAuthRepo from "./types/authTypes";
import { logError } from "../helper/utils/logError";
import { signupDataType } from "../request/request";
import { generateToken } from "../helper/utils/auth";
import PrismaDatabase from "../helper/db/prismaDatabase";

const prismaDatabase = new PrismaDatabase();
const prisma = prismaDatabase.prisma;

class AuthRepo implements IAuthRepo {
  async login(
    loginData: signupDataType
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
      const users = await prisma.user.findMany();
      console.log(users);

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

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
          id: existingUser.id,
          userType: existingUser.role,
          email: existingUser.email,
          name: existingUser.name,
        };

        return [
          userData,
          generateToken(email, existingUser.id.toString(), existingUser.role),
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

  async signup(
    loginData: signupDataType
  ): Promise<[any | null, string | undefined, Error | null, number]> {
    try {
      const { email, password, role, name } = loginData;

      if (!email || !password)
        return [
          null,
          undefined,
          new Error("Email,Name or Password missing from request"),
          HttpStatus.HTTP_NO_CONTENT,
        ];

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      const saltRounds = parseInt(process.env.SALT_ROUND as string, 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      if (existingUser)
        return [
          null,
          undefined,
          new Error("User already exist"),
          HttpStatus.HTTP_BAD_REQUEST,
        ];

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
          role,
        },
      });

      if (newUser) {
        const userData = {
          id: newUser.id,
          role: newUser.role,
          email: newUser.email,
          name: newUser.name,
        };

        return [
          userData,
          generateToken(email, newUser.id.toString(), role),
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
