import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import { LoginDto } from '../dto/request/login.dto';
import { TokenInfo } from '../dto/response/token-info.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    signIn(loginDto: LoginDto): Promise<TokenInfo>;
    reissueJwtToken(id: string, refreshToken: string): Promise<TokenInfo>;
    private createPayload;
    private generateAccessToken;
    private generateRefreshToken;
    logout(id: string): Promise<void>;
}
