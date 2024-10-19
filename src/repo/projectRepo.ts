import mongoose, { PipelineStage, isValidObjectId } from 'mongoose'
import { HttpStatus } from '../helper/config/httpStatus'
import IProjectRepo from './types/projectTypes'
import { IProject, ProjectModel, projectType } from '../model/projects'
import { logError } from '../helper/utils/logError'

class ProjectRepo implements IProjectRepo {
  async addProject(data: projectType): Promise<[boolean, Error | null, number]> {
    try {
      const result = await ProjectModel.create(data)

      if (result) {
        return [true, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [true, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [false, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  async getAllProjects(): Promise<[IProject[] | null, Error | null, number]> {
    try {
      const result = await ProjectModel.aggregate(ProjectRepo.aggregateItems)

      if (result) {
        return [result, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [null, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [null, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  async editProject(
    data: projectType & {
      id: string
    }
  ): Promise<[IProject | null, Error | null, number]> {
    try {
      const { id, ...rest } = data
      if (!isValidObjectId(id)) return [null, new Error('Object id is not valid a format'), HttpStatus.HTTP_BAD_REQUEST]

      const result = await ProjectModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { rest }, { new: true })

      if (result) {
        return [result, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [null, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [null, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  async getProject(id: string): Promise<[IProject | null, Error | null, number]> {
    try {
      if (!isValidObjectId(id)) return [null, new Error('Object id is not valid a format'), HttpStatus.HTTP_BAD_REQUEST]
      const result = await ProjectModel.findById(new mongoose.Types.ObjectId(id), { __v: 0, updatedAt: 0 })

      if (result) {
        return [result, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [null, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [null, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  async updateProjectStatus(data: { id: string; status: boolean }): Promise<[IProject | null, Error | null, number]> {
    try {
      const { status, id } = data

      if (!isValidObjectId(id)) return [null, new Error('Object id is not valid a format'), HttpStatus.HTTP_BAD_REQUEST]

      const result = await ProjectModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        { isActive: status },
        { new: true }
      )

      if (result) {
        return [result, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [null, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [null, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  async deleteProject(id: string): Promise<[boolean, Error | null, number]> {
    try {
      if (!isValidObjectId(id))
        return [false, new Error('Object id is not valid a format'), HttpStatus.HTTP_BAD_REQUEST]

      const result = await ProjectModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { isDeleted: true })

      if (result) {
        return [true, null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [false, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [false, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }

  static aggregateItems = [
    {
      $match: {
        isDeleted: false
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'client_id',
        foreignField: '_id',
        as: 'client_details'
      }
    },
    {
      $lookup: {
        from: 'locations',
        localField: 'location_id',
        foreignField: '_id',
        as: 'location_details'
      }
    },
    {
      $unwind: {
        path: '$client_details',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$location_details',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        __v: 0,
        updatedAt: 0,
        client_details: {
          email: 0,
          hashedPassword: 0,
          userType: 0,
          isDeleted: 0,
          isActive: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0
        },
        location_details: {
          isDeleted: 0,
          isActive: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0
        }
      }
    }
  ]
}

export { IProjectRepo, ProjectRepo }
