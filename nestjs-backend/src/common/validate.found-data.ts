import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExcMsg } from 'src/exceptionHandle/exceptionMessage/global.exception.message';

export const validateFoundData = (foundData: any): void => {
  if (!foundData) {
    throw new HttpException(
      GlobalExcMsg.DATA_IS_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }
};
