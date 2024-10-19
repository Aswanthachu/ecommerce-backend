import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID || "devops-learn-417314",
  keyFilename: "./helper/config/gcp-key-file.json",
});

export default storage;
