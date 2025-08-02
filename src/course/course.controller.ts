import { Body, Controller, Get, Post, Query, Res, BadRequestException, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/createCourse.dto';
import { UpdatedCourseDto } from './dto/updateCourse.dto';
import { ResponseService } from '../base/controller';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { appConst, UserStatus } from '../libs/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
const { ERROR, SUCCESS } = appConst;
import * as _ from 'lodash';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(
    private readonly CourseService: CourseService,
    private readonly responseService: ResponseService,
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
  async create(@Body() createCourseDto: CreateCourseDto, @Res() res: Response) {
    try {
      const existName = await this.CourseService.findByName(createCourseDto.name);
      const existAbbreviation = await this.CourseService.findByAbbreviation(createCourseDto.abbreviation);
      if (existName || existAbbreviation) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1153' }, '1153');
        return;
      }
      const createdCourse = await this.CourseService.create(createCourseDto);
      if (createdCourse) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1054',
          data: {
            _id: (createdCourse as any).id,
            createdAt: (createdCourse as any).createdAt,
          }
        }, '1054');
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
  @ApiQuery({ name: 'userId', required: false, description: 'userId' })
  @ApiQuery({ name: 'name', required: false, description: 'Name' })
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
      const getCourse = await this.CourseService.findAll(queryParams);
      if (!_.isEmpty(getCourse.CourseList)) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getCourse.CourseList,
          count: getCourse.count
        }, '1004');
      }
      else {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1005', data: [], count: getCourse.count }, '1005')
      }
    } catch {
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
      const getByStudent = await this.CourseService.findById(id)
      if (getByStudent) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getByStudent
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
  async update(@Param('id') id: string, @Body() updatedCourseDto: UpdatedCourseDto, @Res() res: any) {
    try {
      const existName = await this.CourseService.findByNameButId(updatedCourseDto.name, id);
      const userExistAbbreviation = await this.CourseService.findByAbbreviationButId(updatedCourseDto.abbreviation, id);
      if (existName || userExistAbbreviation) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1153' }, '1153');
        return;
      }
      const updateStudent = await this.CourseService.update(id, updatedCourseDto);
      if (updateStudent) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1055',
          data: {
            _id: (updateStudent as any).id,
            updatedAt: (updateStudent as any).updatedAt,
          }
        }, '1055');
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
      const deleteCourse = await this.CourseService.delete(id);
      if (deleteCourse) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1056', data: { _id: (deleteCourse as any).id } }, '1056');
      }
      else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch {
      throw new BadRequestException();
    }
  }

}
