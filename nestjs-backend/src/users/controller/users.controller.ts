import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Patch,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/request/signup.dto';
import { Public } from '../../auth/decorator/public.decorator';
import { UsersUrl } from './constant/users-url.constant';
import { UsersResponse } from './response/users.response';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersControllerConstant } from './constant/users-controller.constant';

@Controller(UsersUrl.ROOT)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post(UsersUrl.SIGNUP)
  async signup(@Body() signupDto: SignupDto) {
    await this.usersService.signup(signupDto);
    return UsersResponse.SIGNUP_SUCCESS;
  }

  @Patch(UsersUrl.UPDATE_PASSWORD)
  async updatePassword(@Body() updatePwDto: UpdatePwDto, @Request() req) {
    await this.usersService.updatePassword(updatePwDto, req.user.userId);
    return UsersResponse.UPDATE_PASSWORD_SUCCESS;
  }

  @Delete(UsersUrl.WITHDRAW)
  async withdraw(@Body() withdrawDto: WithdrawDto, @Request() req) {
    const id = req.user.userId;
    await this.usersService.withdraw(withdrawDto, id);
    return UsersResponse.WITHDRAW_SUCCESS;
  }

  //front에서 사용자 정보 필요시 요청하는 api, 클라이언트가 호출하는 api가 아니다
  @Public()
  @Get(UsersUrl.USER_INFO)
  async getUserInfo(@Param(UsersControllerConstant.ID) id: string) {
    const userInfo = await this.usersService.getOneDtoById(id);
    return userInfo;
  }

  @Get(UsersUrl.PROFILE)
  async getProfile(@Request() req) {
    return await this.usersService.getOneDtoById(req.user.userId);
  }

  @Get(UsersUrl.RETURN_ID)
  async getId(@Request() req) {
    return { id: req.user.userId };
  }
}
