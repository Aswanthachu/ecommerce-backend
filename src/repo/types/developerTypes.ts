import { developerCreateType } from "../../request/request";

interface IDeveloperRepo {
  createDeveloper(
    formData: developerCreateType
  ): Promise<[boolean, Error | null, number]>;
}

export default IDeveloperRepo;
