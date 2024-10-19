import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IBranchOfficeTiming {
  day: string;
  open: string;
  close: string;
}

interface IAttachment {
  attachmentId: string;
  imageString: string;
}

interface IBranchType {
  branchTypeId: string;
  name: string;
  attachment: IAttachment;
}

interface IBranch extends Document {
  identity: {
    id: string;
    code: string;
  };
  countryState: {
    stateCode: string;
    stateName: string;
    countryCode: string;
    countryName: string;
  };
  name: string;
  address: string;
  contactNo: string;
  telephoneNo: string;
  emailId: string;
  hoursToGetReady: number;
  description: string;
  message: string;
  googleLocationUrl: string;
  branchType: IBranchType;
  branchOfficeTiming: IBranchOfficeTiming[];
  attachment: IAttachment;
  specialBusinessHours: string[];
  isDocumentRequired: boolean;
  erpSyncDate: string;
  modifiedOn: string;
  isActive: boolean;
  isDeleted: boolean;
}

const branchSchema = new Schema<IBranch>({
  identity: {
    id: { type: String, default: uuidv4, required: true, index: true },
    code: { type: String, required: false, index: true },
  },
  countryState: {
    stateCode: { type: String, required: false, index: true },
    stateName: { type: String, required: false },
    countryCode: { type: String, required: false, index: true },
    countryName: { type: String, required: false },
  },
  name: { type: String, required: false },
  address: { type: String, required: false },
  contactNo: { type: String, required: false },
  telephoneNo: { type: String, required: false },
  emailId: { type: String, required: false, index: true },
  hoursToGetReady: { type: Number, required: false },
  description: { type: String, required: false },
  message: { type: String, required: false },
  googleLocationUrl: { type: String, required: false },
  branchType: {
    branchTypeId: { type: String, required: false },
    name: { type: String, required: false },
    attachment: {
      attachmentId: { type: String, required: false },
      imageString: { type: String, required: false },
    },
  },
  branchOfficeTiming: [{ day: String, open: String, close: String }],
  attachment: {
    attachmentId: { type: String, required: false },
    imageString: { type: String, required: false },
  },
  specialBusinessHours: [{ type: String, required: false }],
  isDocumentRequired: { type: Boolean, default: false },
  erpSyncDate: { type: String, required: false },
  modifiedOn: { type: String, default: Date.now().toString(), required: false },
  isActive: { type: Boolean, default: true, required: false, index: true },
  isDeleted: { type: Boolean, default: false, required: false, index: true },
});

const BranchModel = model<IBranch>("branch", branchSchema);

export { BranchModel, IBranch };
