import { Document, Schema, Types, model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: {
    address: string;
    verified: boolean;
    at?: Date | undefined;
  };
  avatar: string;
  phone: number;
  banned: boolean;
  isDeleted: {
    status: boolean;
    at?: Date | undefined;
  };
  hashedPassword: string;
  userType: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      address: {
        type: String,
        required: true,
        index: true,
        unique: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
      at: {
        type: Date,
      },
    },
    avatar: String,
    phone: Number,
    banned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      status: {
        type: Boolean,
        default: false,
      },
      at: Date,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["super_admin", "customer", "staff", "developers"],
      default: "staff",
      index: true,
    },
  },
  { timestamps: true }
);

type userDataType = {
  id: string;
  userType: string;
  email: string;
  fullName: string;
  username: string;
  password?: string | null;
  avatar?: string | null;
  isActive?: boolean | null;
  isDeleted?: boolean | null;
  role_id?: Types.ObjectId | null;
  client_id?: Types.ObjectId | null;
  data_access_id?: Types.ObjectId | null;
};

const UserModel = model<IUser>("Users", userSchema);

export { UserModel, IUser, userDataType };
