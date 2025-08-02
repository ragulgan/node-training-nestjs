import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { extractTokenFromHeaders } from '../utill/utill';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaders(req.headers);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (_.isEmpty(decoded)) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaders(req.headers);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.role
      return userRole === 'SUPER_ADMIN';
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = extractTokenFromHeaders(req.headers);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.role === 'ADMIN' || decoded.role === 'SUPER_ADMIN';
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}