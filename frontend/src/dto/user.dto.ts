import { IsNotEmpty, IsIn } from 'class-validator';

export class UserDto {
    userIdx!: number;
    userName!: string;
    userId!: string;
    regTime!: Date;
    roles!: string[];
}

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsIn(['admin', 'viewer'])
    role!: string;
}
