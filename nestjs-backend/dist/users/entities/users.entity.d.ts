import { $Enums } from '@prisma/client';
export declare class UsersEntity {
    username: string;
    password: string;
    role: $Enums.Role;
    static create(username: string, password: string): Promise<UsersEntity>;
}
