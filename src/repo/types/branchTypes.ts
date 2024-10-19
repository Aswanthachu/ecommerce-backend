import { IBranch } from "../../model/branch";

interface IBranchRepo {
  createOrUpdateFromERP(data: any[]): Promise<[boolean, Error | null, number]>;

  getAllBranches(
    countryCode?: string
  ): Promise<[IBranch[] | null, Error | null, number]>;

  getAllAdminView(
    param?: string,
    countryCode?: string,
    stateCode?: string,
    branchType?: string,
    sortBy?: string,
    order?: string,
    page?: number,
    limit?: number
  ): Promise<[IBranch[] | null, Error | null, number]>;

  getById(branchID: string): Promise<[IBranch | null, Error | null, number]>;

  getCountry(): Promise<[IBranch[] | null, Error | null, number]>;

  getStateByCountry(
    countryCode: string
  ): Promise<[IBranch[] | null, Error | null, number]>;

  updateById(
    branchId: string,
    updateData: any
  ): Promise<[Error | null, number]>;

  deleteById(branchID: string): Promise<[Error | null, number]>;
}

export default IBranchRepo;
