import { HttpException, HttpStatus } from '@nestjs/common';

export const validateFoundData = (foundData: any): void => {
  if (!foundData) {
    throw new HttpException(
      'Record Is Not Exist In Database',
      HttpStatus.NOT_FOUND,
    );
  }
};
