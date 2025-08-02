import { Body, Controller, Get, Post, Query, Res, BadRequestException, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/createDepartment.dto';
import { UpdateDepartmentDto } from './dto/updateDepartment.dto';
import { ResponseService } from '../base/controller';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { appConst, UserStatus } from '../libs/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
const { ERROR, SUCCESS } = appConst;
import * as _ from 'lodash';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(
    private readonly DepartmentService: DepartmentService,
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
  async create(@Body() createDepartmentDto: CreateDepartmentDto, @Res() res: Response) {
    try {
      const existName = await this.DepartmentService.findByName(createDepartmentDto.name);
      const existAbbreviation = await this.DepartmentService.findByAbbreviation(createDepartmentDto.abbreviation);
      if (existName || existAbbreviation) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1156' }, '1156');
        return;
      }
      const createdDepartment = await this.DepartmentService.create(createDepartmentDto);
      if (createdDepartment) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1056',
          data: {
            _id: (createdDepartment as any).id,
            createdAt: (createdDepartment as any).createdAt,
          }
        }, '1056');
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
  @ApiQuery({ name: 'status', enum: UserStatus, required: false, description: 'Return Based on status' })
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
      const getDepartment = await this.DepartmentService.findAll(queryParams);
      if (!_.isEmpty(getDepartment.DepartmentList)) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getDepartment.DepartmentList,
          count: getDepartment.count
        }, '1004');
      }
      else {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1005', data: [], count: getDepartment.count }, '1005')
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
      const getByStudent = await this.DepartmentService.findById(id)
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
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto, @Res() res: any) {
    try {
      const existName = await this.DepartmentService.findByNameButId(updateDepartmentDto.name, id);
      const existAbbreviation = await this.DepartmentService.findByAbbreviationButId(updateDepartmentDto.abbreviation, id);
      if (existName || existAbbreviation) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1156' }, '1156');
        return;
      }
      const updateStudent = await this.DepartmentService.update(id, updateDepartmentDto);
      if (updateStudent) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1057',
          data: {
            _id: (updateStudent as any).id,
            updatedAt: (updateStudent as any).updatedAt,
          }
        }, '1057');
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
      const deleteDepartment = await this.DepartmentService.delete(id);
      if (deleteDepartment) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1058', data: { _id: (deleteDepartment as any).id } }, '1058');
      }
      else {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1003' }, '1003');
      }
    } catch {
      throw new BadRequestException();
    }
  }

}
