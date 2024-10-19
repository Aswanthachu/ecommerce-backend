import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

function decryptToken(token: string): any {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    return decoded
  } catch (error) {
    return null
  }
}

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' })
  }

  const decryptedData = decryptToken(token)

  if (!decryptedData) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const { userId, userType } = decryptedData

  // req.userId = userId
  // req.userType = userType

  next()
}
