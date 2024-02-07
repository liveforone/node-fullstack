import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/request/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginRequest: LoginDto): Promise<import("../dto/response/token-info.dto").TokenInfo>;
    reissueJwtToken(req: any, idObj: any): Promise<import("../dto/response/token-info.dto").TokenInfo>;
    logout(req: any): Promise<"로그아웃에 성공하였습니다.">;
}
