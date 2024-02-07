import { Injectable, Logger } from '@nestjs/common';
import { SignupDto } from '../dto/request/signup.dto';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { UsersEntity } from '../entities/users.entity';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersServiceLog } from '../log/users.service.log';
import { UsersRepository } from '../repository/users.repository';
import { encodePassword } from 'src/auth/util/PasswordEncoder';
import { validateUserPassword } from '../validator/users.validator';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersRepository: UsersRepository) {}

  async signup(signupDto: SignupDto) {
    const { username, password } = signupDto;
    const user = await UsersEntity.create(username, password);
    await this.usersRepository.save(user);
    this.logger.log(UsersServiceLog.SIGNUP_SUCCESS + username);
  }

  async updatePassword(updatePwDto: UpdatePwDto, id: string) {
    const { originalPw, newPw } = updatePwDto;
    const user = await this.usersRepository.findOneById(id);
    await validateUserPassword(originalPw, user.password);
    await this.usersRepository.updatePasswordById(
      await encodePassword(newPw),
      id,
    );
    this.logger.log(UsersServiceLog.UPDATE_PW_SUCCESS + id);
  }

  async saveRefreshToken(username: string, refreshToken: string) {
    await this.usersRepository.addRefreshToken(username, refreshToken);
  }

  async reissueRefreshToken(reissuedRefreshToken: string, id: string) {
    await this.usersRepository.reissueRefreshToken(reissuedRefreshToken, id);
  }

  async removeRefreshToken(id: string) {
    await this.usersRepository.removeRefreshToken(id);
    this.logger.log(UsersServiceLog.REMOVE_REFRESH_TOKEN_SUCCESS + id);
  }

  async withdraw(withdrawDto: WithdrawDto, id: string) {
    const user = await this.usersRepository.findOneById(id);
    await validateUserPassword(withdrawDto.password, user.password);
    await this.usersRepository.deleteOneById(id);
    this.logger.log(UsersServiceLog.WITHDRAW_SUCCESS + id);
  }

  async getOneByUsername(username: string) {
    return await this.usersRepository.findOneByUsername(username);
  }

  async getOneById(id: string) {
    return await this.usersRepository.findOneById(id);
  }

  async getOneDtoById(id: string) {
    return await this.usersRepository.findOneUserInfoById(id);
  }

  async getRefreshTokenById(id: string) {
    return await this.usersRepository.findRefreshTokenById(id);
  }
}
