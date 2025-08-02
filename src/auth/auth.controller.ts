import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AdminDto, CreateAdminDto, UserLoginDto } from './dto/login.dto';
import { ResponseService } from '../base/controller';
import { appConst } from 'src/libs/constants';
const { ERROR, SUCCESS } = appConst;

@ApiTags('Auth')
@Controller('auth/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseService: ResponseService,
  ) { }

  @Post('login/user')
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'Ok.',  
    schema: {
    example: {
      code: 0,
      messageCode: 0,
        data: {
          id: "string",
          userMobile: "string",
          email: "string",
          status: "string",
          token: "string",
        },
      message: 'string',
    }
  }})
  @ApiResponse({ status: 201, description: 'Created.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  @ApiResponse({ status: 403, description: 'Forbidden.'})
  @ApiResponse({ status: 404, description: 'Not Found.'})
  async UserLogin(@Body() createUserDto: UserLoginDto, @Res() res: Response) {
    const result = await this.authService.userLogin(createUserDto);
    if (result && result.user.status !== "DELETED") {
      this.responseService.sendResponse({}, res, SUCCESS.CODE, {
        code: '1014',
        data: {
          id: result.user._id,
          userMobile: result.user.userMobile,
          email: result.user.email,
          status: result.user.status,
          token: result.token
        }
      }, '1014');
    }else if (result && result.user.status === "DELETED") {
      this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1100' }, '1100');
    }
    else {
      this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1018' }, '1018');
    }
    return result;
  }

  @Post('login/admin')
    @ApiBody({ type: AdminDto })
    async AdminLogin(@Body() createAdminDto: CreateAdminDto, @Res() res) {
        const result = await this.authService.adminLogin(createAdminDto);
        if (result) {
            this.responseService.sendResponse({}, res, SUCCESS.CODE, {
                code: '1014',
                data: {
                    id: result.user._id,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    profileImage: result.user.profileImage,
                    mobileNumber: result.user.mobileNumber,
                    email: result.user.email,
                    role: result.user.role.role,
                    status: result.user.status,
                    token: result.token
                }
            }, '1014');
        } else {
            this.responseService.sendResponse({}, res, ERROR.CLIENT_ERROR.BAD_REQUEST, { code: '1018' }, '1018');
        }
        return result;
    }

}
