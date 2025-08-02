import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { College } from './college.schema';
import { Course } from 'src/course/course.schema';
import { CreateCollegeDto } from './dto/createCollege.dto';
import { UpdateCollegeDto } from './dto/updateCollege.dto';
import * as _ from 'lodash';

@Injectable()
export class CollegeService {
  constructor(
    @InjectModel(College.name) private CollegeModel: Model<College>,
    // @InjectModel(Course.name) private CourseModel: Model<Course>,
  ) { }

  async create(createCollegeDto: CreateCollegeDto): Promise<College> {
    try {
      const createdCollege = new this.CollegeModel(createCollegeDto);
      const data = await createdCollege.save();
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


    if (queryParams.collegeName || queryParams.code) {
      const orCondition = []
      if (queryParams.collegeName) {
        orCondition.push({
          collegeName: new RegExp(`${queryParams.collegeName}`, 'i')
        });
      }
      if (queryParams.code) {
        orCondition.push({
          code: new RegExp(`${queryParams.code}`, 'i')
        });
      }
      match = { ...match, $or: orCondition }
    }

    if (queryParams.status) {
      match.status = queryParams.status;
    }

    const CollegeList = await this.CollegeModel.find(match).sort({ createdAt: -1 }).skip(skipValue).limit(limit).exec();
    const count = await this.CollegeModel.countDocuments(match).exec()
    return { CollegeList, count };
  }

  async findById(id: string): Promise<College> {
    return this.CollegeModel.findById(id).exec();
  }

  async findByCode(code: number): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ code: code }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByPhone(phone: string): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ phone: phone }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByEmail(email: string): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ email: email }], status: { $ne: 'DELETED' } }).exec();
  }

  async findByCodeButId(code: number, id: string): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ code: code }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async findByPhoneButId(phone: string, id: string): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ phone: phone }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async findByEmailButId(email: string, id: string): Promise<College | null> {
    return await this.CollegeModel.findOne({ $or: [{ email: email }], _id: { $ne: id }, status: { $ne: 'DELETED' } }).exec();
  }

  async update(id: string, updatedCollegeDto: UpdateCollegeDto): Promise<College> {
    try {
      const updatedCollege = await this.CollegeModel.findOneAndUpdate({ _id: id }, updatedCollegeDto, { new: true }).exec();
      if (!updatedCollege) {
        throw new Error("User not found");
      }
      return updatedCollege;
    } catch (error) {
      console.error("Update Error:", error);
      throw new Error(`${error.message}`);
    }
  }

  async delete(id: string): Promise<College> {
    // const isReferenced = await this.CourseModel.exists({ userId: id });

    // if (isReferenced) {
    //   throw new ConflictException('Cannot delete user because they are referenced in courses.');
    // }
    const deletedCollege = await this.CollegeModel
      .findByIdAndUpdate(
        id,
        { $set: { status: 'DELETED' } },
        { new: true }
      )
      .lean()
      .exec();
    return deletedCollege
  }

}
