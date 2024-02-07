import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const JwtStratey_base: new (...args: any[]) => Strategy;
export declare class JwtStratey extends JwtStratey_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        userId: any;
    }>;
}
export {};
