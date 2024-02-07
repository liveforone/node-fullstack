import { PrismaService } from 'src/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UsersEntity } from '../entities/users.entity';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    save(usersEntity: UsersEntity): Promise<void>;
    updatePasswordById(newPassword: string, id: string): Promise<void>;
    addRefreshToken(username: string, refreshToken: string): Promise<void>;
    reissueRefreshToken(reissuedRefreshToken: string, id: string): Promise<void>;
    removeRefreshToken(id: string): Promise<void>;
    deleteOneById(id: string): Promise<void>;
    findOneByUsername(username: string): Promise<Users>;
    findOneById(id: string): Promise<Users>;
    findOneUserInfoById(id: string): Promise<any>;
    findRefreshTokenById(id: string): Promise<{
        refresh_token: string;
    }>;
}
