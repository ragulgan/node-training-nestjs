import { Body, Controller, Get, Post, Query, Res, BadRequestException, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/createCollege.dto';
import { UpdateCollegeDto } from './dto/updateCollege.dto';
import { ResponseService } from '../base/controller';
import { appConst, UserStatus } from '../libs/constants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
const { ERROR, SUCCESS } = appConst;
import * as _ from 'lodash';


@ApiTags('College')
@Controller('college')
export class CollegeController {
  constructor(
    private readonly CollegeService: CollegeService,
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
  async create(@Body() createCollegeDto: CreateCollegeDto, @Res() res: Response) {
    try {
      const existCode = await this.CollegeService.findByCode(createCollegeDto.code);
      const existEmail = await this.CollegeService.findByPhone(createCollegeDto.phone);
      const existPhone = await this.CollegeService.findByEmail(createCollegeDto.email);
      if (existCode || existEmail || existPhone) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1345' }, '1345');
        return;
      }
      const createdCollege = await this.CollegeService.create(createCollegeDto);
      if (createdCollege) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1050',
          data: {
            _id: (createdCollege as any).id,
            createdAt: (createdCollege as any).createdAt,
          }
        }, '1050');
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
      const getCollege = await this.CollegeService.findAll(queryParams);
      if (!_.isEmpty(getCollege.CollegeList)) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getCollege.CollegeList,
          count: getCollege.count
        }, '1004');
      }
      else {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1005', data: [], count: getCollege.count }, '1005')
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
      const getByCollege = await this.CollegeService.findById(id)
      if (getByCollege) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1004',
          data: getByCollege
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
  async update(@Param('id') id: string, @Body() updatedCollegeDto: UpdateCollegeDto, @Res() res: any) {
    try {
      const existCode = await this.CollegeService.findByCodeButId(updatedCollegeDto.code, id);
      const existEmail = await this.CollegeService.findByPhoneButId(updatedCollegeDto.phone, id);
      const existPhone = await this.CollegeService.findByEmailButId(updatedCollegeDto.email, id);
      if (existCode || existEmail || existPhone) {
        this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1345' }, '1345');
        return;
      }
      const updateCollege = await this.CollegeService.update(id, updatedCollegeDto);
      if (updateCollege) {
        this.responseService.sendResponse({}, res, SUCCESS.CODE, {
          code: '1051',
          data: {
            _id: (updateCollege as any).id,
            updatedAt: (updateCollege as any).updatedAt,
          }
        }, '1051');
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
    const deleteCollege = await this.CollegeService.delete(id);
    if (deleteCollege) {
      this.responseService.sendResponse({}, res, SUCCESS.CODE, { code: '1052', data: { _id: (deleteCollege as any).id } }, '1052');
    }
    else {
      this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1053' }, '1053');
    }
  } catch {
    throw new BadRequestException();
  }
}


}
