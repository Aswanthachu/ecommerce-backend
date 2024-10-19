// import { Controller, Route, Body, Tags, Example, Post } from 'tsoa'
// import { HttpStatus } from '../helper/config/httpStatus'
// import { PropertyRepo, IPropertyRepo } from '../repo/propertyRepo'
// import { logError } from '../helper/utils/logError'

// const propertyRepo: IPropertyRepo = new PropertyRepo()

// @Route('api/property')
// @Tags('Property')
// class AuthController extends Controller {
//   @Post('create-property')
//   @Example({
//     email: 'example@gmail.com',
//     password: 'Example@123'
//   })
//   public async createDeveloper(@Body() formData: any): Promise<{ data?: any;  error?: string }> {
//     try {
//       const [developer,error, httpStatus] = await propertyRepo.createDeveloper(formData)

//       if (error) {
//         this.setStatus(httpStatus)
//         return { error: error.message }
//       }
//       this.setStatus(httpStatus)
//       return { data: developer  }
//     } catch (error) {
//       this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
//       logError(error)
//       return {
//         error: error as string
//       }
//     }
//   }
// }

// export { AuthController }
