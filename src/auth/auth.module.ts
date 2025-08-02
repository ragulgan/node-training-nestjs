import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from "./auth.service";
import { AuthController } from './auth.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { LocalStrategy } from './local.auth';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { ResponseService } from '../base/controller';
import { UserModule } from "src/user/user.module";
import { CourseModule } from "src/course/course.module";
import { AdminService } from '../adminUsers/admin.service';
import { Admin, AdminSchema } from "../adminUsers/admin.schema";
import { AdminActivity, AdminActivitySchema } from '../adminUsers/adminActivites.schema';
import { User, UserSchema } from "../user/user.schema";
import { UserService } from "../user/user.service";
import { Role, RoleSchema } from '../role/role.schema';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // secret: process.env.JWT_SECRET,
      secret: 'mySecretKey123',
      signOptions: { expiresIn: '30d' },
    }),
    MongooseModule.forFeature([{ name: AdminActivity.name, schema: AdminActivitySchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    UserModule,
    CourseModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, JwtAuthGuard, ResponseService, UserService, LocalStrategy, JwtStrategy, AdminService ],
})
export class AuthModule { }
