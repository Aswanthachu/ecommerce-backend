import { Document, Schema, Types, model } from 'mongoose'

type projectType = {
  project_name: string
  display_name: string
  client_id: Types.ObjectId
  location_id: Types.ObjectId
}

interface IProject extends Document, projectType {
  isActive: boolean
  isDeleted: boolean
}

const projectSchema = new Schema<IProject>(
  {
    project_name: {
      type: String,
      required: true,
      index: true
    },
    display_name: {
      type: String,
      required: true,
      index: true
    },
    client_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    location_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

const ProjectModel = model<IProject>('Projects', projectSchema)

export { ProjectModel, IProject, projectType }
