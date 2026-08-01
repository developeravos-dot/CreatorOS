import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';

@ApiTags('Enterprise Identity')
@ApiBearerAuth()
@Controller('identity')
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}

  @RequirePermissions(Permissions.IdentityDashboardRead)
  @Get('dashboard')
  dashboard() { return this.identity.dashboard(); }

  @RequirePermissions(Permissions.UsersWrite)
  @Post('users')
  createUser(@Body() input: CreateUserDto) { return this.identity.createUser(input); }

  @RequirePermissions(Permissions.UsersRead)
  @Get('users')
  listUsers() { return this.identity.listUsers(); }

  @RequirePermissions(Permissions.UsersRead)
  @Get('users/:userId')
  getUser(@Param('userId') userId: string) { return this.identity.getUser(userId); }

  @RequirePermissions(Permissions.UsersWrite)
  @Patch('users/:userId')
  updateUser(@Param('userId') userId: string, @Body() input: UpdateUserDto) { return this.identity.updateUser(userId, input); }

  @RequirePermissions(Permissions.UsersWrite)
  @Delete('users/:userId')
  disableUser(@Param('userId') userId: string) { return this.identity.disableUser(userId); }

  @RequirePermissions(Permissions.UsersWrite)
  @Put('users/:userId/profile')
  upsertProfile(@Param('userId') userId: string, @Body() input: UpdateProfileDto) { return this.identity.upsertProfile(userId, input); }

  @RequirePermissions(Permissions.RolesWrite)
  @Post('users/:userId/roles')
  assignRole(@Param('userId') userId: string, @Body() input: AssignRoleDto) { return this.identity.assignRole(userId, input.roleKey); }

  @RequirePermissions(Permissions.RolesWrite)
  @Delete('users/:userId/roles/:roleKey')
  removeRole(@Param('userId') userId: string, @Param('roleKey') roleKey: string) { return this.identity.removeRole(userId, roleKey); }

  @RequirePermissions(Permissions.RolesRead)
  @Get('roles')
  listRoles() { return this.identity.listRoles(); }

  @RequirePermissions(Permissions.RolesWrite)
  @Post('roles')
  createRole(@Body() input: CreateRoleDto) { return this.identity.createRole(input); }

  @RequirePermissions(Permissions.RolesWrite)
  @Patch('roles/:roleKey')
  updateRole(@Param('roleKey') roleKey: string, @Body() input: UpdateRoleDto) { return this.identity.updateRole(roleKey, input); }

  @RequirePermissions(Permissions.PermissionsRead)
  @Get('permissions')
  listPermissions() { return this.identity.listPermissions(); }

  @RequirePermissions(Permissions.PermissionsWrite)
  @Post('permissions')
  createPermission(@Body() input: CreatePermissionDto) { return this.identity.createPermission(input); }

  @RequirePermissions(Permissions.SessionsWrite)
  @Post('users/:userId/sessions')
  createSession(@Param('userId') userId: string, @Body() input: CreateSessionDto) { return this.identity.createSession(userId, input); }

  @RequirePermissions(Permissions.SessionsRead)
  @Get('users/:userId/sessions')
  listSessions(@Param('userId') userId: string) { return this.identity.listSessions(userId); }

  @RequirePermissions(Permissions.SessionsWrite)
  @Delete('users/:userId/sessions/:sessionId')
  revokeSession(@Param('userId') userId: string, @Param('sessionId') sessionId: string) { return this.identity.revokeSession(userId, sessionId); }

  @RequirePermissions(Permissions.ApiKeysWrite)
  @Post('users/:userId/api-keys')
  createApiKey(@Param('userId') userId: string, @Body() input: CreateCredentialDto) { return this.identity.createApiKey(userId, input); }

  @RequirePermissions(Permissions.ApiKeysRead)
  @Get('users/:userId/api-keys')
  listApiKeys(@Param('userId') userId: string) { return this.identity.listApiKeys(userId); }

  @RequirePermissions(Permissions.ApiKeysWrite)
  @Delete('users/:userId/api-keys/:keyId')
  revokeApiKey(@Param('userId') userId: string, @Param('keyId') keyId: string) { return this.identity.revokeApiKey(userId, keyId); }

  @RequirePermissions(Permissions.TokensWrite)
  @Post('users/:userId/personal-access-tokens')
  createPersonalAccessToken(@Param('userId') userId: string, @Body() input: CreateCredentialDto) { return this.identity.createPersonalAccessToken(userId, input); }

  @RequirePermissions(Permissions.TokensRead)
  @Get('users/:userId/personal-access-tokens')
  listPersonalAccessTokens(@Param('userId') userId: string) { return this.identity.listPersonalAccessTokens(userId); }

  @RequirePermissions(Permissions.TokensWrite)
  @Delete('users/:userId/personal-access-tokens/:tokenId')
  revokePersonalAccessToken(@Param('userId') userId: string, @Param('tokenId') tokenId: string) { return this.identity.revokePersonalAccessToken(userId, tokenId); }
}