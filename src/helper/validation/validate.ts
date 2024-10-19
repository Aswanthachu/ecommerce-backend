import Ajv, { JSONSchemaType } from 'ajv'
import ajvFormats from 'ajv-formats'
import { Request, Response } from 'express'
import { HttpStatus } from '../config/httpStatus'

const ajv = new Ajv({ allErrors: true })
ajvFormats(ajv)
type SchemaType<T> = JSONSchemaType<T>

const validate = <T>(schema: SchemaType<T>) => {
  return (req: Request, res: Response, next: Function) => {
    const validate = ajv.compile(schema)

    const valid = validate({ ...req.body, ...req.query, ...req.params, ...req.file });

    if (!valid) {
      return res.status(HttpStatus.HTTP_BAD_REQUEST).json({ error: validate.errors })
    }

    next()
  }
}

export default validate
