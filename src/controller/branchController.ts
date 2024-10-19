import { JSONSchemaType } from 'ajv'
import { Request as ExpressRequest } from 'express'
import { Body, Controller, Delete, Example, Get, Path, Put, Query, Request, Route, Tags } from 'tsoa'
import { HttpStatus } from '../helper/config/httpStatus'
import { t } from '../helper/config/localization'
import { redisHandler } from '../helper/utils/redisCache'
import validate from '../helper/validation/validate'
import { BranchRepo, IBranchRepo } from '../repo/branchRepo'
import * as validationSchema from '../request/request'

const branchRepo: IBranchRepo = new BranchRepo()

@Route('api/branch')
@Tags('Branch')
class BranchController extends Controller {
  @Get('all')
  public async getAllBranches(
    @Request() request: ExpressRequest,
    @Query() countryCode?: string
  ): Promise<{ data?: any; error?: string }> {
    try {
      const cachedData = await redisHandler.get(request.originalUrl)
      if (cachedData) {
        this.setStatus(HttpStatus.HTTP_SUCCESS)
        return {
          data: JSON.parse(cachedData)
        }
      }

      const [branches, error, httpStatus] = await branchRepo.getAllBranches(countryCode)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }
      await redisHandler.set(request.originalUrl, JSON.stringify(branches), (process.env.REDIS_EXPIRY || 5) as number)
      this.setStatus(httpStatus)
      return { data: branches || [] }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Get('allAdmin')
  public async getAllAdminView(
    @Request() request: ExpressRequest,
    @Query() param?: string,
    @Query() countryCode?: string,
    @Query() stateCode?: string,
    @Query() branchType?: string,
    @Query() sortBy?: string,
    @Query() order?: string,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ): Promise<{ data?: any; error?: string }> {
    try {
      // await validate(validationSchema.adminViewQuerySchema as JSONSchemaType<any>)

      const cachedData = await redisHandler.get(request.originalUrl)
      if (cachedData) {
        this.setStatus(HttpStatus.HTTP_SUCCESS)
        return {
          data: JSON.parse(cachedData)
        }
      }

      const [branches, error, httpStatus] = await branchRepo.getAllAdminView(
        param,
        countryCode,
        stateCode,
        branchType,
        sortBy,
        order,
        page,
        limit
      )

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }

      await redisHandler.set(request.originalUrl, JSON.stringify(branches), (process.env.REDIS_EXPIRY || 5) as number)
      this.setStatus(httpStatus)

      return { data: branches || [] }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Get('{id}/fetch')
  public async getById(
    @Request() request: ExpressRequest,
    @Path() id: string
  ): Promise<{ data?: any; error?: string }> {
    try {
      const cachedData = await redisHandler.get(request.originalUrl)
      if (cachedData) {
        this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
        return {
          data: JSON.parse(cachedData)
        }
      }

      const [branch, error, httpStatus] = await branchRepo.getById(id)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }

      await redisHandler.set(request.originalUrl, JSON.stringify(branch), (process.env.REDIS_EXPIRY || 5) as number)

      this.setStatus(httpStatus)
      return { data: branch || null }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Get('countries')
  public async getCountry(@Request() request: ExpressRequest): Promise<{ data?: any; error?: string }> {
    try {
      const cachedData = await redisHandler.get(request.originalUrl)
      if (cachedData) {
        this.setStatus(HttpStatus.HTTP_SUCCESS)
        return {
          data: JSON.parse(cachedData)
        }
      }

      const [branch, error, httpStatus] = await branchRepo.getCountry()

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }

      await redisHandler.set(request.originalUrl, JSON.stringify(branch), (process.env.REDIS_EXPIRY || 5) as number)
      this.setStatus(httpStatus)
      return { data: branch || [] }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Get('states')
  public async getStateByCountry(
    @Request() request: ExpressRequest,
    @Query() countryCode: string
  ): Promise<{ data?: any; error?: string }> {
    try {
      // await validate(validationSchema.stateQuerySchema as JSONSchemaType<any>)

      const cachedData = await redisHandler.get(request.originalUrl)
      if (cachedData) {
        this.setStatus(HttpStatus.HTTP_SUCCESS)
        return {
          data: JSON.parse(cachedData)
        }
      }

      const [branch, error, httpStatus] = await branchRepo.getStateByCountry(countryCode)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }

      await redisHandler.set(request.originalUrl, JSON.stringify(branch), (process.env.REDIS_EXPIRY || 5) as number)

      this.setStatus(httpStatus)
      return { data: branch || [] }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Put('{id}')
  @Example({
    countryState: {
      stateCode: 'DXB',
      stateName: 'Dubai',
      countryCode: 'AE',
      countryName: 'United Arab Emirates'
    },
    name: 'Branch Name',
    address: '123 Main St',
    contactNo: '123-456-7890',
    telephoneNo: '987-654-3210',
    emailId: 'branch@example.com',
    hoursToGetReady: 2,
    description: 'Branch description',
    message: 'Branch message',
    googleLocationUrl: 'https://maps.google.com/...',
    branchType: {
      branchTypeId: '12345678-1234-1234-1234-123456789abc',
      name: 'Branch Type Name',
      attachment: {
        attachmentId: '98765432-4321-4321-4321-210987654321',
        imageString: 'base64-encoded-image'
      }
    },
    branchOfficeTiming: [
      {
        day: '1',
        open: '09:00',
        close: '18:00'
      }
    ],
    attachment: {
      attachmentId: '98765432-4321-4321-4321-210987654321',
      imageString: 'base64-encoded-image'
    },
    specialBusinessHours: [],
    isDocumentRequired: true,
    erpSyncDate: '2024-03-30T12:00:00Z',
    modifiedOn: '2024-03-30T12:00:00Z',
    isActive: true,
    isDeleted: false
  })
  public async updateBranchById(
    @Path() id: string,
    @Body() updateData: any
  ): Promise<{ data?: { message: string }; error?: string }> {
    try {

      const [error, httpStatus] = await branchRepo.updateById(id, updateData)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }
      this.setStatus(httpStatus)
      return { data: { message: t.update_successful } }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }

  @Delete('{id}')
  public async deleteById(@Path() id: string): Promise<{ data?: { message: string }; error?: string }> {
    try {
      const [error, httpStatus] = await branchRepo.deleteById(id)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }

      this.setStatus(httpStatus)
      return { data: { message: t.delete_successful } }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      return {
        error: error as string
      }
    }
  }
}

export { BranchController }
