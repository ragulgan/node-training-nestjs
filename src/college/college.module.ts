import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollegeService } from './college.service';
import { College, CollegeSchema } from './college.schema';
import { CollegeController } from './college.controller';
import { ResponseService } from '../base/controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }])
  ],
  controllers: [CollegeController],
  providers: [CollegeService, ResponseService],
  exports: [CollegeService],
})
export class CollegeModule {}
