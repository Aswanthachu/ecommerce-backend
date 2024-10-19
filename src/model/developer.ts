import { Document, Schema, model, Types } from "mongoose";

interface IDeveloper extends Document {
  userId: Types.ObjectId;
  logo: string;
  // book_now_link: string;
  // agent_link: string;
}

const developerSchema = new Schema<IDeveloper>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    logo: String,
  },
  { timestamps: true }
);

type developerDataType = {
  userId: string;
  logo: string;
};

const DeveloperModel = model<IDeveloper>("developer", developerSchema);

export { DeveloperModel, IDeveloper, developerDataType };
