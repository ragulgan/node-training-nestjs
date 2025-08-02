import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './role.schema';
import { CreateRoleDto } from './dto/create.dto';
import { UpdateRoleDto } from './dto/update.dto';



@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private RoleModel: Model<Role>) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const createdState = new this.RoleModel(createRoleDto);
      const data = await createdState.save();
      return data
    } catch (error) {
      console.error("Validation Error:", error);
      throw new Error(`${error.message}`);
    }
  }

  async findAll(queryParams: any) {
    const limit = Number(queryParams.limit)
    const page = Number(queryParams.page)
    const skipValue = Number(page - 1) * limit
    let match: any = { status: 'ACTIVE' }

    if (queryParams.role) {
      const orCondition = []
      orCondition.push({
        role: new RegExp(`${queryParams.role}`, 'i')
      }, {
        displayName: new RegExp(`${queryParams.role}`, 'i')
      });
      match = { ...match, $or: orCondition }
    }

    if (queryParams.status) {
      match.status = queryParams.status;
    }

    const roleList = await this.RoleModel.find(match).sort({ createdAt: -1 }).skip(skipValue).limit(limit).exec();
    const count = await this.RoleModel.countDocuments(match).exec()
    return { roleList, count };
  }

  async findById(id: string): Promise<Role> {
    return this.RoleModel.findById(id).exec();
  }

  async findByRole(role: string): Promise<Role | null> {
    return await this.RoleModel.findOne({ role: role, status: { $ne: 'DELETED' } }).exec();
  }

  async findByDisplayName(displayName: string): Promise<Role | null> {
    return await this.RoleModel.findOne({ displayName: displayName, status: { $ne: 'DELETED' } }).exec();
  }

  async findByRoleButId(role: string, id: string): Promise<Role | null> {
    return await this.RoleModel.findOne({ role: role, _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async findByDisplayNameButId(displayName: string, id: string): Promise<Role | null> {
    return await this.RoleModel.findOne({ displayName: displayName, _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.RoleModel.findOneAndUpdate({ _id: id }, updateRoleDto).exec();
  }


  async delete(id: string): Promise<Role> {
    const deleteSite = await this.RoleModel
      .findByIdAndUpdate(
        id,
        { $set: { status: 'DELETED' } },
        { new: true }
      ).lean()
      .exec();
    return deleteSite;
  }

}
