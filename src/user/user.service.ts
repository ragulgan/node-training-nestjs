import { Model } from 'mongoose';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Course } from 'src/course/course.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatedUserDto } from './dto/updateUser.dto';
import * as _ from 'lodash';
const bcrypt = require('bcrypt')

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Course.name) private CourseModel: Model<Course>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.UserModel(createUserDto);
      const data = await createdUser.save();
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


    if (queryParams.userName || queryParams.userMobile) {
      const orCondition = []
      if (queryParams.userName) {
        orCondition.push({
          userName: new RegExp(`${queryParams.userName}`, 'i')
        });
      }
      if (queryParams.userMobile) {
        orCondition.push({
          userMobile: new RegExp(`${queryParams.userMobile}`, 'i')
        });
      }
      match = { ...match, $or: orCondition }
    }

    if (queryParams.status) {
      match.status = queryParams.status;
    }

    const UserList = await this.UserModel.find(match)
    .sort({ createdAt: -1 })
    .skip(skipValue)
    .limit(limit)
    // .select('-password')
    .populate('role', 'id role').exec();
    const count = await this.UserModel.countDocuments(match).exec()
    return { UserList, count };
  }

  async findById(id: string): Promise<User> {
    return this.UserModel.findById(id).select('-password').populate('role', 'id role').exec();
  }

  async findByName(userName: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [{ userName: userName }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByMobile(userMobile: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [{ userMobile: userMobile }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [{ email: email }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByNameButId(userName: string, id: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [ { userName: userName }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async findByMobileButId(userMobile: string, id: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [ { userMobile: userMobile }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async findByEmailButId(email: string, id: string): Promise<User | null> {
    return await this.UserModel.findOne({ $or: [ { email: email }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  // async update(id: string, updatedUserDto: UpdatedUserDto): Promise<User> {
  //   return this.UserModel.findOneAndUpdate({ _id: id }, updatedUserDto).exec();
  // }

  async update(id: string, updatedUserDto: UpdatedUserDto): Promise<User> {
    try {
      const updatedUser = await this.UserModel.findOneAndUpdate({ _id: id }, updatedUserDto, { new: true }).exec();
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      console.error("Update Error:", error);
      throw new Error(`${error.message}`);
    }
  }

  async delete(id: string): Promise<User> {
    const isReferenced = await this.CourseModel.exists({ userId: id });

    if (isReferenced) {
      throw new ConflictException('Cannot delete user because they are referenced in courses.');
    }
    const deletedUser = await this.UserModel
      .findByIdAndUpdate(
        id,
        { $set: { status: 'DELETED' } },
        { new: true }
      )
      .lean()
      .exec();
    return deletedUser
  }

  // async delete(id: string): Promise<User> {
  //   const user = await this.UserModel.findById(id).lean().exec();
  
  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }
  
  //   if (user.status === 'DELETED') {
  //     return user;
  //   }
  
  //   const updatedUser = await this.UserModel
  //     .findByIdAndUpdate(
  //       id,
  //       { $set: { status: 'DELETED' } },
  //       { new: true }
  //     )
  //     .lean()
  //     .exec();
  //   return updatedUser;
  // }
  

  async userLogin(req: any) {
    const user: any = await this.UserModel.findOne({ email: req.email }).populate('role');
    if (!user) return false;
    const isPasswordMatch = bcrypt.compareSync(req.password, user.password);
    if (!isPasswordMatch) return false;
    return user;
  }
}
