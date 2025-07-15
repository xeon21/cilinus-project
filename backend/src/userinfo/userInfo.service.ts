import { UsersRepository } from './userinfo.repository';
import { Injectable, UnauthorizedException, NotFoundException } from "@nestjs/common";
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserInfoService {
  
    constructor(
        private readonly usersRepository: UsersRepository,
    ) {}

    async changePassword(userIdx: number, changePasswordDto: ChangePasswordDto): Promise<void> {
        const { currentPassword, newPassword } = changePasswordDto;

        const user = await this.usersRepository.findUserByIdx(userIdx);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const isPasswordMatching = await bcrypt.compare(currentPassword, user.UserPass);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
        }

        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        await this.usersRepository.updatePassword(userIdx, hashedNewPassword);
    }

    getUserInfo(uIndex: number) {
        return this.usersRepository.getUserInfo(uIndex);
    }

    getMyTreeInfo(uIndex: number) {
        return this.usersRepository.getMyTreeInfo(uIndex);
    }

    getMyNusuryInfo(uIndex: number) {
        return this.usersRepository.getMyNusuryInfo(uIndex);
    }

     getMyItem(uIndex: number) {
        return this.usersRepository.getMyItem(uIndex);
    }
}
