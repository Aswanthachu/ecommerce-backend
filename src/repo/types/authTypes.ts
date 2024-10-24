import { loginDataType, signupDataType } from "../../request/request";

interface IAuthRepo {
  login(
    loginData: loginDataType
  ): Promise<[any | null, string | undefined, Error | null, number]>;

  signup(
    loginData: signupDataType
  ): Promise<[any | null, string | undefined, Error | null, number]>;
}

export default IAuthRepo;
