import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthUrl } from './constant/auth.url';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorator/public.decorator';
import { LoginDto } from '../dto/request/login.dto';
import { AuthControllerConstant } from './constant/auth.controller.constant';
import { AuthResponse } from './response/auth.controller.response';

@Controller(AuthUrl.ROOT)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post(AuthUrl.LOGIN)
  async login(@Body() loginRequest: LoginDto) {
    const tokenInfo = await this.authService.signIn(loginRequest);
    return tokenInfo;
  }

  /*
  id를 any로 받은 이유는 { "id": "value" } 형태로 입력받기 위함이다.
  */
  @Public()
  @Post(AuthUrl.REISSUE)
  async reissueJwtToken(@Request() req, @Body() idObj: any) {
    const tokenInfo = await this.authService.reissueJwtToken(
      idObj.id,
      req.headers[AuthControllerConstant.REFRESH_TOKEN_HEADER],
    );
    return tokenInfo;
  }

  @Post(AuthUrl.LOGOUT)
  async logout(@Request() req) {
    await this.authService.logout(req.user.userId);
    return AuthResponse.LOGOUT_SUCCESS;
  }
}
