import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './config/logger';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module'
import { CollegeModule } from './college/college.module';
import { UserModule } from './user/user.module'
import { CourseModule } from './course/course.module'
import { DepartmentModule } from './department/department.module';
import { FileModule } from './uploads/upload.module';
import { AdminModule } from './adminUsers/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URL),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'static'), }),
    AuthModule,
    AdminModule,
    RoleModule,
    CollegeModule,
    DepartmentModule,
    UserModule,
    CourseModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
