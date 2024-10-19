import { userCreateType } from "../../request/request";

interface IUserRepo {
  createUser(
    userData: userCreateType
  ): Promise<[boolean, Error | null, number]>;
}

export default IUserRepo;
