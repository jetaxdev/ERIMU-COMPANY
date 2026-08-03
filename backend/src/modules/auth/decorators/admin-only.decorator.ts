import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

const adminRoles: Role[] = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];

export const AdminOnly = () => applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...adminRoles));
