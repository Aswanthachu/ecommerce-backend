import { JSONSchemaType } from "ajv";

export type loginDataType = {
  email: string;
  password: string;
};

export type signupDataType = {
  email: string;
  password: string;
  role: "buyer" | "seller";
};

const authPostSchema: JSONSchemaType<loginDataType> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

const signupPostSchema: JSONSchemaType<signupDataType> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    role: { type: "string", enum: ["buyer", "seller"] },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

export type userCreateType = {
  name: string;
  email: string;
  password: string;
};

const userPostSchema: JSONSchemaType<userCreateType> = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: { type: "string" },
    name: { type: "string" },
  },
  required: ["email", "password", "name"],
  additionalProperties: false,
};

export type developerCreateType = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  logo?: string;
  userType: "customer" | "staff" | "developer";
};

const developerPostSchema: JSONSchemaType<developerCreateType> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 1 },
    phone: { type: "string", minLength: 8, nullable: true },
    avatar: { type: "string", minLength: 1, nullable: true },
    logo: { type: "string", minLength: 1, nullable: true },
    userType: { type: "string", enum: ["customer", "staff", "developer"] },
  },
  required: ["name", "email", "password", "userType"],
  additionalProperties: false,
};

const userGetSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

const userStatusPutSchema: JSONSchemaType<{ status: boolean; id: string }> = {
  type: "object",
  properties: {
    status: { type: "boolean" },
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["status", "id"],
  additionalProperties: false,
};

const userDeleteSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

interface ZipType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: object;
  size: number;
}

interface reqObjectType {
  userId: string;
  locationId: string;
  projectId: string;
}

const partsPostSchema: JSONSchemaType<ZipType & reqObjectType> = {
  type: "object",
  properties: {
    userId: { type: "string", minLength: 24, maxLength: 24 },
    locationId: { type: "string", minLength: 24, maxLength: 24 },
    projectId: { type: "string", minLength: 24, maxLength: 24 },
    fieldname: { type: "string" },
    originalname: { type: "string" },
    encoding: { type: "string" },
    mimetype: { type: "string" },
    buffer: { type: "object" },
    size: { type: "number" },
  },
  required: [
    "userId",
    "locationId",
    "projectId",
    "fieldname",
    "originalname",
    "buffer",
  ],
  additionalProperties: false,
};

const partsFilterGetSchema: JSONSchemaType<{ userId: string }> = {
  type: "object",
  properties: {
    userId: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["userId"],
  additionalProperties: false,
};

const partsGetSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

const partsStatusPutSchema: JSONSchemaType<{ status: boolean; id: string }> = {
  type: "object",
  properties: {
    status: { type: "boolean" },
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["status", "id"],
  additionalProperties: false,
};

const partsDeleteSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

// role schema
const rolePostSchema: JSONSchemaType<{
  name: string;
}> = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
  additionalProperties: false,
};

const rolePutSchema: JSONSchemaType<{
  name: string;
  id: string;
}> = {
  type: "object",
  properties: {
    name: { type: "string" },
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["name", "id"],
  additionalProperties: false,
};

const roleGetSchema: JSONSchemaType<{
  id: string;
}> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

const roleDeleteSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 24, maxLength: 24 },
  },
  required: ["id"],
  additionalProperties: false,
};

export {
  authPostSchema,
  signupPostSchema,

  userPostSchema,
  developerPostSchema,
  userGetSchema,
  userDeleteSchema,
  userStatusPutSchema,
  partsStatusPutSchema,
  partsDeleteSchema,
  partsGetSchema,
  partsFilterGetSchema,
  partsPostSchema,
  rolePostSchema,
  rolePutSchema,
  roleGetSchema,
};
