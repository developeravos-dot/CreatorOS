import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { OperationsService } from './operations.service';
import { CreateDeploymentDto, CreateIncidentDto, CreateOpsServiceDto, CreateRunbookDto, CreateSlaDto, TransitionDeploymentDto, UpdateIncidentDto, UpdateOpsServiceDto } from './dto/operations.dto';

@ApiTags('Enterprise Operations')
@ApiBearerAuth()
@Controller('operations')
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}
  @Get('dashboard') @RequirePermissions(Permissions.OperationsDashboardRead) dashboard(){ return this.operations.dashboard(); }
  @Get('services') @RequirePermissions(Permissions.OperationsRead) services(){ return this.operations.listServices(); }
  @Post('services') @RequirePermissions(Permissions.OperationsWrite) createService(@Body() body:CreateOpsServiceDto){ return this.operations.createService(body); }
  @Patch('services/:id') @RequirePermissions(Permissions.OperationsWrite) updateService(@Param('id') id:string,@Body() body:UpdateOpsServiceDto){ return this.operations.updateService(id,body); }
  @Get('incidents') @RequirePermissions(Permissions.OperationsRead) incidents(){ return this.operations.listIncidents(); }
  @Post('incidents') @RequirePermissions(Permissions.IncidentsManage) createIncident(@Body() body:CreateIncidentDto){ return this.operations.createIncident(body); }
  @Patch('incidents/:id') @RequirePermissions(Permissions.IncidentsManage) updateIncident(@Param('id') id:string,@Body() body:UpdateIncidentDto){ return this.operations.updateIncident(id,body); }
  @Get('runbooks') @RequirePermissions(Permissions.OperationsRead) runbooks(){ return this.operations.listRunbooks(); }
  @Post('runbooks') @RequirePermissions(Permissions.OperationsWrite) createRunbook(@Body() body:CreateRunbookDto){ return this.operations.createRunbook(body); }
  @Get('slas') @RequirePermissions(Permissions.OperationsRead) slas(){ return this.operations.listSlas(); }
  @Post('slas') @RequirePermissions(Permissions.OperationsWrite) createSla(@Body() body:CreateSlaDto){ return this.operations.createSla(body); }
  @Get('deployments') @RequirePermissions(Permissions.OperationsRead) deployments(){ return this.operations.listDeployments(); }
  @Post('deployments') @RequirePermissions(Permissions.DeploymentsManage) createDeployment(@Body() body:CreateDeploymentDto){ return this.operations.createDeployment(body); }
  @Patch('deployments/:id/transition') @RequirePermissions(Permissions.DeploymentsManage) transitionDeployment(@Param('id') id:string,@Body() body:TransitionDeploymentDto){ return this.operations.transitionDeployment(id,body); }
}
