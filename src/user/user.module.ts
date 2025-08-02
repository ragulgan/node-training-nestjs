import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { Course, CourseSchema } from '../course/course.schema';
import { UserController } from './user.controller';
import { ResponseService } from '../base/controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, ResponseService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}