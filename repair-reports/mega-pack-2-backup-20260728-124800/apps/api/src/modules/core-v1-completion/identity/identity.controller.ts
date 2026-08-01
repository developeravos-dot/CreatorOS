import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';

@ApiTags('Identity')
@ApiBearerAuth()
@Controller('identity')
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}

  @RequirePermissions(Permissions.UsersWrite)
  @Post('users')
  create(@Body() input: CreateUserDto) {
    return this.identity.createUser(input);
  }

  @RequirePermissions(Permissions.UsersRead)
  @Get('users')
  list() {
    return this.identity.listUsers();
  }

  @RequirePermissions(Permissions.RolesWrite)
  @Post('users/:userId/roles')
  assignRole(
    @Param('userId') userId: string,
    @Body() input: AssignRoleDto,
  ) {
    return this.identity.assignRole(userId, input.roleKey);
  }
}