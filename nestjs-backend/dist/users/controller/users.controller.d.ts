import { UsersService } from '../service/users.service';
import { SignupDto } from '../dto/request/signup.dto';
import { UpdatePwDto } from '../dto/request/update-password.dto';
import { WithdrawDto } from '../dto/request/withdraw.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(signupDto: SignupDto): Promise<"회원가입에 성공했습니다.">;
    updatePassword(updatePwDto: UpdatePwDto, req: any): Promise<"비밀번호 변경에 성공하였습니다.">;
    withdraw(withdrawDto: WithdrawDto, req: any): Promise<"회원탈퇴에 성공하였습니다.">;
    getUserInfo(id: string): Promise<any>;
    getProfile(req: any): Promise<any>;
    getId(req: any): Promise<{
        id: any;
    }>;
}
