import { HttpException, HttpStatus } from '@nestjs/common';

export const validateFoundData = (foundData: any): void => {
  if (!foundData) {
    throw new HttpException(
      '데이터가 존재하지 않습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
};
