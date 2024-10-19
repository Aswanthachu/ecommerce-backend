import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import { HttpStatus } from '../../helper/config/httpStatus'

export function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  const token = request.headers.authorization as string

  if (!token) {
    return Promise.reject({
      status: HttpStatus.HTTP_UNAUTHORIZED,
      message: 'No token provided'
    })
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
        return reject({
          status: HttpStatus.HTTP_UNAUTHORIZED,
          message: 'Failed to authenticate token'
        })
      }

      resolve(decoded)
    })
  })
}

export function generateToken(email: string, userId: string, userType: string): string {
  const payload = { email, userId, userType }

  return jwt.sign(payload, process.env.JWT_SECRET as string)
}

interface DecodedToken {
  userId: string
  userType: string
}

export function decodeToken(req: Request): DecodedToken | null {
  try {
    const token = req.headers.authorization

    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
