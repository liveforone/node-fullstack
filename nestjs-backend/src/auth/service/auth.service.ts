import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvPath } from '../../config/env_path.constant';
import { UsersService } from '../../users/service/users.service';
import { LoginDto } from '../dto/request/login.dto';
import { AuthExcMsg } from 'src/exceptionHandle/exceptionMessage/auth.exception.message';
import { AuthServiceLog } from '../log/auth.service.log';
import { TokenInfo } from '../dto/response/token-info.dto';
import { validateUserPassword } from 'src/users/validator/users.validator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.usersService.getOneByUsername(username);
    await validateUserPassword(password, user.password);

    const refreshToken = await this.generateRefreshToken();
    await this.usersService.saveRefreshToken(username, refreshToken);
    const id = user.id;
    this.logger.log(AuthServiceLog.SIGNIN_SUCCESS + username);
    return new TokenInfo(await this.generateAccessToken(id), refreshToken);
  }

  async reissueJwtToken(id: string, refreshToken: string) {
    const foundRefreshToken = await this.usersService.getRefreshTokenById(id);
    if (foundRefreshToken.refresh_token != refreshToken) {
      throw new UnauthorizedException(AuthExcMsg.REFRESH_TOKEN_IS_NOT_MATCH);
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get(EnvPath.SECRET_KEY),
      });
    } catch (err) {
      throw new UnauthorizedException(AuthExcMsg.REFRESH_TOKEN_IS_EXPIRE);
    }

    const reissuedRefreshToken = await this.generateRefreshToken();
    await this.usersService.reissueRefreshToken(reissuedRefreshToken, id);
    this.logger.log(AuthServiceLog.REISSUE_TOKEN_SUCCESS + id);

    return new TokenInfo(
      await this.generateAccessToken(id),
      reissuedRefreshToken,
    );
  }

  private createPayload(id: string) {
    return { sub: id };
  }

  private async generateAccessToken(id: string) {
    return await this.jwtService.signAsync(this.createPayload(id));
  }

  private async generateRefreshToken() {
    //payload에 아무것도 안 넣더라도 빈 객체를 넣어야 정상적으로 토큰이 만들어진다.
    return await this.jwtService.signAsync(
      {},
      {
        secret: this.configService.get(EnvPath.SECRET_KEY),
        expiresIn: this.configService.get(
          EnvPath.REFRESH_TOKEN_EXPIRATION_TIME,
        ),
      },
    );
  }

  async logout(id: string) {
    await this.usersService.removeRefreshToken(id);
    this.logger.log(AuthServiceLog.LOGOUT_SUCCESS + id);
  }
}
