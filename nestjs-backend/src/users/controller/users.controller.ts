import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Patch,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/request/signup.dto';
import { Public } from '../../auth/decorator/public.decorator';
import { UsersUrl } from './constant/users.url';
import { UsersResponse } from './response/users.controller.response';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersControllerConstant } from './constant/users.controller.constant';
import { CACHE_MANAGER, Cache, CacheInterceptor } from '@nestjs/cache-manager';
import { UsersCacheKey } from 'src/cache/key/users.cache.key';

@Controller(UsersUrl.ROOT)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER)
    private cacheManger: Cache,
  ) {}

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
    await this.cacheManger.del(UsersCacheKey.USER_INFO + id);
    return UsersResponse.WITHDRAW_SUCCESS;
  }

  //front에서 사용자 정보 필요시 요청하는 api, 클라이언트가 호출하는 api가 아니다
  @Public()
  @Get(UsersUrl.USER_INFO)
  @UseInterceptors(CacheInterceptor)
  async userInfo(@Param(UsersControllerConstant.ID) id: string) {
    const userInfo = await this.usersService.getOneDtoById(id);
    return userInfo;
  }

  @Get(UsersUrl.PROFILE)
  async profile(@Request() req) {
    return await this.usersService.getOneDtoById(req.user.userId);
  }

  @Get(UsersUrl.RETURN_ID)
  async returnId(@Request() req) {
    return { id: req.user.userId };
  }
}
