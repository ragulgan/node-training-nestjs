import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { Role, RoleSchema } from './role.schema'; 
import { RoleController } from './role.controller';
import { ResponseService } from '../base/controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],  
  controllers: [RoleController],
  providers: [RoleService , ResponseService],
  exports: [RoleService],
})
export class RoleModule {}
