import { Body, Controller, Get, Post, Query, Res, BadRequestException, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatedUserDto } from './dto/updateUser.dto';
import { ResponseService } from '../base/controller';
import { appConst, UserStatus } from '../libs/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
const { ERROR, SUCCESS } = appConst;
import { Model } from 'mongoose';
import * as _ from 'lodash';


@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly UserService: UserService,
    private readonly responseService: ResponseService,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 200, description: 'Ok.',  
    schema: {
    example: {
      code: 0,
      messageCode: 0,
      data: {},
      message: 'string',
    }
  }})
  @ApiResponse({ status: 201, description: 'Created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Not Found.'})
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      createUserDto.email, createUserDto.userMobile
      const existName = await this.UserService.findByName(createUserDto.userName);
      const existMobile = await this.UserService.findByMobile(createUserDto.userMobile);
      const existEmail = await this.UserService.findByEmail(createUserDto.email);
      if (existName || existMobile || existEmail) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1117' }, '1117');
        return;
      }
      const createdUser = await this.UserService.create(createUserDto);
      if (createdUser) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1002',
          data: {
            _id: (createdUser as any).id,
            createdAt: (createdUser as any).createdAt,
          }
        }, '1002');
      }
      else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch (e) {
      this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, e.message, '1003');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, })
  @ApiQuery({ name: 'limit', required: false, })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false, description: 'status' })
  @ApiQuery({ name: 'userName', required: false, description: 'userName' })
  @ApiQuery({ name: 'userMobile', required: false, description: 'userMobile' })
  @Get()
  @ApiResponse({ status: 200, description: 'Ok.', 
    schema: {
    example: {
      code: 0,
      messageCode: 0,
      data: {},
      count: 0,
      message: 'string',
    }
  }})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Not Found.'})
  async findAll(@Query() queryParams: { limit?: number; skip?: number }, @Res() res: any) {
    try {
      const getUser = await this.UserService.findAll(queryParams);
      if (!_.isEmpty(getUser.UserList)) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getUser.UserList,
          count: getUser.count
        }, '1004');
      }
      else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch (error) {
      console.log("Error#", error);
      throw new BadRequestException();
    }
  }


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Ok.', 
    schema: {
    example: {
      code: 0,
      messageCode: 0,
      data: {},
      message: 'string',
    }
  }})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Not Found.'})
  async findById(@Param('id') id: string, @Res() res: any) {
    try {
      const getByUser = await this.UserService.findById(id)
      if (getByUser) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getByUser
        }, '1004');
      } else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch {
      throw new BadRequestException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiResponse({ status: 200, description: 'Ok.',  
    schema: {
    example: {
      code: 0,
      messageCode: 0,
      data: {},
      message: 'string',
    }
  }})
  @ApiResponse({ status: 201, description: 'Created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Not Found.'})
  async update(@Param('id') id: string, @Body() updatedUserDto: UpdatedUserDto, @Res() res: any) {
    try {
      const userExistName = await this.UserService.findByNameButId(updatedUserDto.userName, id);
      const userExistMobile = await this.UserService.findByMobileButId(updatedUserDto.userMobile, id);
      const userExistEmail = await this.UserService.findByEmailButId(updatedUserDto.userMobile, id);

      if (userExistName && userExistName._id.toString() !== id || userExistMobile && userExistMobile._id.toString() !== id || userExistEmail && userExistEmail._id.toString() !== id) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1117' }, '1117');
        return;
      }
      const updateUser = await this.UserService.update(id, updatedUserDto);
      if (updateUser) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1006',
          data: {
            _id: (updateUser as any).id,
            updatedAt: (updateUser as any).updatedAt,
          }
        }, '1006');
      } else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch {
      throw new BadRequestException();
    }
  }

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Delete(':id')
@ApiResponse({ status: 200, description: 'Ok.',  
  schema: {
  example: {
    code: 0,
    messageCode: 0,
    message: 'string',
  }
}})
@ApiResponse({ status: 401, description: 'Unauthorized.'})
@ApiResponse({ status: 403, description: 'Forbidden.'})
@ApiResponse({ status: 404, description: 'Not Found.'})
async delete(@Param('id') id: string, @Res() res: any) {
  try {
    const deleteUser = await this.UserService.delete(id);
    if (deleteUser) {
      this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1007', data: { _id: (deleteUser as any).id } }, '1007');
    }
    else {
      this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
    }
  } catch {
    throw new BadRequestException();
  }
}


}
