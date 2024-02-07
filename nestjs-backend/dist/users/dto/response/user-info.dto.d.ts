import { $Enums } from '@prisma/client';
export interface UserInfo {
    readonly id: string;
    readonly username: string;
    readonly role: $Enums.Role;
}
