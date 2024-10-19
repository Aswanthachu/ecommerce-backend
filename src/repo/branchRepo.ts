import { BranchModel, IBranch } from "../model/branch";
import IBranchRepo from "./types/branchTypes";
import { PipelineStage, isValidObjectId } from "mongoose";
import { HttpStatus } from "../helper/config/httpStatus";
import { t } from "../helper/config/localization";

class BranchRepo implements IBranchRepo {
  async createOrUpdateFromERP(
    data: any[]
  ): Promise<[boolean, Error | null, number]> {
    try {
      const bulkOperations = data.map((branchData) => {
        const filter = {
          "countryState.stateCode": branchData.Emirate,
          "identity.code": branchData.LocationCode.trim(),
        };

        const update = {
          $set: {
            "countryState.stateName": branchData.Emirate,
            name: branchData.LocationName,
            "countryState.countryCode": branchData.Emirate,
            "countryState.countryName": branchData.CompanyLocation,
            erpSyncDate: new Date(),
            isActive: branchData.Active,
          },
        };

        return {
          updateOne: {
            filter,
            update,
            upsert: true,
          },
        };
      });

      const result = await BranchModel.bulkWrite(bulkOperations);

      if (result && result.upsertedCount) {
        return [true, null, HttpStatus.HTTP_SUCCESS];
      } else {
        return [false, null, HttpStatus.HTTP_BAD_REQUEST];
      }
    } catch (error) {
      return [
        false,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async getAllBranches(
    countryCode?: string
  ): Promise<[IBranch[] | null, Error | null, number]> {
    try {
      const query: Record<string, any> = {
        isDeleted: false,
      };

      if (countryCode) {
        query["countryState.countryCode"] = countryCode;
      }

      const branches = await BranchModel.find(query);

      if (!branches) {
        return [
          null,
          new Error("No branches found"),
          HttpStatus.HTTP_BAD_REQUEST,
        ];
      }

      return [branches, null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      return [
        null,
        new Error("Error: " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async getAllAdminView(
    param: string,
    countryCode: string,
    stateCode: string,
    branchType: string,
    sortBy: string,
    order: string,
    page: number,
    limit: number
  ): Promise<[IBranch[] | null, Error | null, number]> {
    try {
      const matchQuery: Record<string, any> = { isDeleted: false };

      if (param) matchQuery.$text = { $search: param };
      if (countryCode) matchQuery["countryState.countryCode"] = countryCode;
      if (stateCode) matchQuery["countryState.stateCode"] = stateCode;
      if (branchType) matchQuery["branchType.name"] = branchType;

      const sortOrder = order === "desc" ? -1 : 1;
      const sortQuery: Record<string, any> = {};
      if (sortBy) sortQuery[sortBy] = sortOrder;

      const pipeline: PipelineStage[] = [];

      if (Object.keys(matchQuery).length > 0) {
        pipeline.push({ $match: matchQuery });
      }

      if (Object.keys(sortQuery).length > 0) {
        pipeline.push({ $sort: sortQuery });
      }

      pipeline.push({ $skip: (page - 1) * limit });
      pipeline.push({ $limit: limit });

      const branches = await BranchModel.aggregate(pipeline);

      if (!branches) {
        return [
          null,
          new Error(t.no_branches_found),
          HttpStatus.HTTP_BAD_REQUEST,
        ];
      }

      return [branches, null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      return [
        null,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async getById(
    branchID: string
  ): Promise<[IBranch | null, Error | null, number]> {
    try {
      if (!isValidObjectId(branchID)) {
        return [null, new Error(t.invalid_uuid), HttpStatus.HTTP_BAD_REQUEST];
      }
      const branch = await BranchModel.findOne({
        _id: branchID,
        isDeleted: false,
      });

      if (!branch) {
        return [
          null,
          new Error(t.no_branches_found),
          HttpStatus.HTTP_BAD_REQUEST,
        ];
      }

      return [branch.toObject(), null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      return [
        null,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async getCountry(): Promise<[IBranch[] | null, Error | null, number]> {
    try {
      const countries = await BranchModel.find(
        { isDeleted: false },
        { "countryState.countryCode": 1, "countryState.countryName": 1 }
      );

      if (countries.length === 0) {
        return [
          null,
          new Error(t.no_countries_found),
          HttpStatus.HTTP_BAD_REQUEST,
        ];
      }

      return [
        countries.map((country) => country.toObject()),
        null,
        HttpStatus.HTTP_SUCCESS,
      ];
    } catch (error) {
      return [
        null,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async getStateByCountry(
    countryCode: string
  ): Promise<[IBranch[] | null, Error | null, number]> {
    try {
      const states = await BranchModel.aggregate([
        {
          $match: { "countryState.countryCode": countryCode, isDeleted: false },
        },
        {
          $group: {
            _id: "$countryState.stateCode",
            stateName: { $first: "$countryState.stateName" },
          },
        },
        { $project: { _id: 0, stateCode: "$_id", stateName: 1 } },
      ]);

      if (states.length === 0) {
        return [
          null,
          new Error(t.no_states_found),
          HttpStatus.HTTP_BAD_REQUEST,
        ];
      }

      return [states, null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      return [
        null,
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async updateById(
    branchId: string,
    updateData: any
  ): Promise<[Error | null, number]> {
    try {
      if (!isValidObjectId(branchId)) {
        return [new Error(t.invalid_uuid), HttpStatus.HTTP_BAD_REQUEST];
      }

      const branch = await BranchModel.findById(branchId);

      if (!branch) {
        return [new Error(t.no_branches_found), HttpStatus.HTTP_BAD_REQUEST];
      }

      const filter = { _id: branchId };

      const updatedData = {
        countryState: {
          countryCode: updateData.countryCode,
          countryName: updateData.countryName,
        },
        name: updateData.name,
        address: updateData.address,
        contactNo: updateData.contactNo,
        telephoneNo: updateData.telephoneNo,
        emailId: updateData.emailID,
        hoursToGetReady: updateData.hoursToGetReady,
        description: updateData.description,
        message: updateData.message,
        googleLocationUrl: updateData.googleLocationURL,
        branchType: {
          branchTypeId: updateData.branchType.branchTypeID,
          name: updateData.branchType.Name,
          attachment: {
            attachmentId: updateData.branchType.attachment.attachmentID,
            imageString: updateData.branchType.attachment.imageString,
          },
        },
      };

      const result = await BranchModel.updateOne(filter, updatedData);

      if (result.modifiedCount > 0) {
        return [new Error(t.update_failed), HttpStatus.HTTP_SUCCESS];
      } else {
        return [new Error(t.update_failed), HttpStatus.HTTP_BAD_REQUEST];
      }
    } catch (error) {
      return [
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }

  async deleteById(branchID: string): Promise<[Error | null, number]> {
    try {
      if (!isValidObjectId(branchID)) {
        return [new Error(t.invalid_uuid), HttpStatus.HTTP_BAD_REQUEST];
      }

      const branch = await BranchModel.findById(branchID);

      if (!branch) {
        return [new Error(t.no_branches_found), HttpStatus.HTTP_BAD_REQUEST];
      }

      branch.isDeleted = true;

      await branch.save();

      return [null, HttpStatus.HTTP_SUCCESS];
    } catch (error) {
      return [
        new Error("Error " + error),
        HttpStatus.HTTP_INTERNAL_SERVER_ERROR,
      ];
    }
  }
}

export { IBranchRepo, BranchRepo };
