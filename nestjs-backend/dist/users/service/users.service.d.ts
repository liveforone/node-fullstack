import { SignupDto } from '../dto/request/signup.dto';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { WithdrawDto } from '../dto/request/withdraw.dto';
import { UsersRepository } from '../repository/users.repository';
import { RedisClientType } from 'redis';
export declare class UsersService {
    private readonly redis;
    private usersRepository;
    private readonly logger;
    constructor(redis: RedisClientType, usersRepository: UsersRepository);
    signup(signupDto: SignupDto): Promise<void>;
    updatePassword(updatePwDto: UpdatePwDto, id: string): Promise<void>;
    saveRefreshToken(username: string, refreshToken: string): Promise<void>;
    reissueRefreshToken(reissuedRefreshToken: string, id: string): Promise<void>;
    removeRefreshToken(id: string): Promise<void>;
    withdraw(withdrawDto: WithdrawDto, id: string): Promise<void>;
    getOneByUsername(username: string): Promise<{
        id: string;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        refresh_token: string;
    }>;
    getOneById(id: string): Promise<{
        id: string;
        username: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        refresh_token: string;
    }>;
    getOneDtoById(id: string): Promise<any>;
    getRefreshTokenById(id: string): Promise<{
        refresh_token: string;
    }>;
}
