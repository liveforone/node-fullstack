import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import {
  PrismaCommonErrCode,
  PrismaCommonErrMsg,
  PrismaCommonErrStatus,
} from 'src/prisma/error/prisma-common-error.constant';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message: string;
    let status: number;

    switch (exception.code) {
      case PrismaCommonErrCode.P2000:
        message = PrismaCommonErrMsg.P2000;
        status = PrismaCommonErrStatus.P2000;
        break;
      case PrismaCommonErrCode.P2001:
        message = PrismaCommonErrMsg.P2001;
        status = PrismaCommonErrStatus.P2001;
        break;
      case PrismaCommonErrCode.P2002:
        message = PrismaCommonErrMsg.P2002;
        status = PrismaCommonErrStatus.P2002;
        break;
      case PrismaCommonErrCode.P2003:
        message = PrismaCommonErrMsg.P2003;
        status = PrismaCommonErrStatus.P2003;
        break;
      case PrismaCommonErrCode.P2004:
        message = PrismaCommonErrMsg.P2004;
        status = PrismaCommonErrStatus.P2004;
        break;
      case PrismaCommonErrCode.P2005:
        message = PrismaCommonErrMsg.P2005;
        status = PrismaCommonErrStatus.P2005;
        break;
      case PrismaCommonErrCode.P2006:
        message = PrismaCommonErrMsg.P2006;
        status = PrismaCommonErrStatus.P2006;
        break;
      case PrismaCommonErrCode.P2007:
        message = PrismaCommonErrMsg.P2007;
        status = PrismaCommonErrStatus.P2007;
        break;
      case PrismaCommonErrCode.P2008:
        message = PrismaCommonErrMsg.P2008;
        status = PrismaCommonErrStatus.P2008;
        break;
      case PrismaCommonErrCode.P2009:
        message = PrismaCommonErrMsg.P2009;
        status = PrismaCommonErrStatus.P2009;
        break;
      case PrismaCommonErrCode.P2010:
        message = PrismaCommonErrMsg.P2010;
        status = PrismaCommonErrStatus.P2010;
        break;
      case PrismaCommonErrCode.P2011:
        message = PrismaCommonErrMsg.P2011;
        status = PrismaCommonErrStatus.P2011;
        break;
      case PrismaCommonErrCode.P2012:
        message = PrismaCommonErrMsg.P2012;
        status = PrismaCommonErrStatus.P2012;
        break;
      case PrismaCommonErrCode.P2013:
        message = PrismaCommonErrMsg.P2013;
        status = PrismaCommonErrStatus.P2013;
        break;
      case PrismaCommonErrCode.P2014:
        message = PrismaCommonErrMsg.P2014;
        status = PrismaCommonErrStatus.P2014;
        break;
      case PrismaCommonErrCode.P2015:
        message = PrismaCommonErrMsg.P2015;
        status = PrismaCommonErrStatus.P2015;
        break;
      case PrismaCommonErrCode.P2016:
        message = PrismaCommonErrMsg.P2016;
        status = PrismaCommonErrStatus.P2016;
        break;
      case PrismaCommonErrCode.P2017:
        message = PrismaCommonErrMsg.P2017;
        status = PrismaCommonErrStatus.P2017;
        break;
      case PrismaCommonErrCode.P2018:
        message = PrismaCommonErrMsg.P2018;
        status = PrismaCommonErrStatus.P2018;
        break;
      case PrismaCommonErrCode.P2019:
        message = PrismaCommonErrMsg.P2019;
        status = PrismaCommonErrStatus.P2019;
        break;
      case PrismaCommonErrCode.P2020:
        message = PrismaCommonErrMsg.P2020;
        status = PrismaCommonErrStatus.P2020;
        break;
      case PrismaCommonErrCode.P2021:
        message = PrismaCommonErrMsg.P2021;
        status = PrismaCommonErrStatus.P2021;
        break;
      case PrismaCommonErrCode.P2022:
        message = PrismaCommonErrMsg.P2022;
        status = PrismaCommonErrStatus.P2022;
        break;
      case PrismaCommonErrCode.P2023:
        message = PrismaCommonErrMsg.P2023;
        status = PrismaCommonErrStatus.P2023;
        break;
      case PrismaCommonErrCode.P2024:
        message = PrismaCommonErrMsg.P2024;
        status = PrismaCommonErrStatus.P2024;
        break;
      case PrismaCommonErrCode.P2025:
        message = PrismaCommonErrMsg.P2025;
        status = PrismaCommonErrStatus.P2025;
        break;
      case PrismaCommonErrCode.P2026:
        message = PrismaCommonErrMsg.P2026;
        status = PrismaCommonErrStatus.P2026;
        break;
      case PrismaCommonErrCode.P2027:
        message = PrismaCommonErrMsg.P2027;
        status = PrismaCommonErrStatus.P2027;
        break;
      default:
        message = exception.message.replace(/\n/g, '');
        status = HttpStatus.BAD_REQUEST;
        break;
    }

    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
