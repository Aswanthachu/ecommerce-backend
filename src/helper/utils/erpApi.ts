import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../helper/config/httpStatus";
import { t } from "../../helper/config/localization";
import { ErpHeaders } from "../../helper/types/header";
import { logger } from "../../helper/utils/logger";

interface CustomError {
  message: string;
  code: number;
}

class erpApi {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, customHeaders?: ErpHeaders) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        ...customHeaders,
      },
    });
  }

  private handleError(error: any): CustomError {
    const customError: CustomError = {
      message: error.message || t.an_error_occurred,
      code: error.response?.status || HttpStatus.HTTP_BAD_REQUEST,
    };

    return customError;
  }

  private async handleAxiosRequest(
    method: string,
    url: string,
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const axiosRequestConfig: AxiosRequestConfig = {
        method,
        url,
        data: req.body,
        params: req.query,
        headers: req.headers,
      };

      logger.info(`Axios Request Config:`, axiosRequestConfig);

      const response = await this.axiosInstance.request(
        axiosRequestConfig as AxiosRequestConfig
      );

      return response.data; // Return the response data
    } catch (error) {
      const customError = this.handleError(error);
      res.status(customError.code).json({ error: customError.message });
    }
  }

  public handleExpressGet(url: string) {
    return async (req: Request, res: Response): Promise<void> => {
      await this.handleAxiosRequest("GET", url, req, res);
    };
  }

  public handleExpressPost(url: string) {
    return async (req: Request, res: Response): Promise<void> => {
      await this.handleAxiosRequest("POST", url, req, res);
    };
  }
}

export default erpApi;
