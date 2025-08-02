import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from "../user/user.schema";
import { UserLoginDto } from './dto/login.dto';
import { AdminService } from 'src/adminUsers/admin.service';
const saltOrRounds = 10;


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private readonly userService: UserService,
        private readonly adminService: AdminService,
    ) { }

    decodeToken(token: string): any {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            return null;
        }
    }

    async validateUser(mobileNumber: string, createUserDto): Promise<User> {
        const result = await this.userService.findAll(mobileNumber);
        const user = result.UserList[0];
        if (user) {
            return user;
        }
    }

    async validateUserByEmail(email: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotAcceptableException('Could not find the user');
        }
        return user;
    }

    async userLogin(createUserDto: UserLoginDto) {
        const result = await this.userService.userLogin(createUserDto);
        if (!result) return false;
        const payload = await this.userGeneratePayload(result);
        return {
            user: result,
            token: this.jwtService.sign(payload)
        };
    }

    async adminLogin(createAdminDto) {
        const result = await this.adminService.adminLogin(createAdminDto);
        if (!result) return false;

        const payload = await this.adminGeneratePayload(result);
        if (payload.role === "ADMIN" || payload.role === 'SUPER_ADMIN') {
            this.adminService.logAdminActivities({
                adminId: payload.id,
                action: 'admin_authenticated',
                activity: 'Admin Authenticated',
                reason: `Logged in`
            }).then(() => { });
        }
        return {
            user: result,
            token: this.jwtService.sign(payload)
        };
    }

    async userGeneratePayload(userData: any) {
        return {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userMobile: userData.userMobile,
            profileImage: userData.profileImage,
            email: userData.email,
            role: userData.role.role,
        }
    }

    async adminGeneratePayload(userData: any) {
        return {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            mobileNumber: userData.mobileNumber,
            email: userData.email,
            profileImage: userData.profileImage,
            role: userData.role.role,
        }
    }
}