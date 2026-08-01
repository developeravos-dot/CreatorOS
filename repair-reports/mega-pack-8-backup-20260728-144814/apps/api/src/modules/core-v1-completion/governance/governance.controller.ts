import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../security/permissions.decorator';
import { Permissions } from '../security/permissions';
import { GovernanceService } from './governance.service';
import { CreateAssessmentDto, CreateChangeRequestDto, CreateComplianceRuleDto, CreateDecisionDto, CreatePolicyDto, CreateRiskDto, DecideDecisionDto, TransitionChangeDto, UpdatePolicyDto, UpdateRiskDto } from './dto/governance.dto';

@ApiTags('Enterprise Governance')
@ApiBearerAuth()
@Controller('governance')
export class GovernanceController {
  constructor(private readonly governance: GovernanceService) {}
  @Get('dashboard') @RequirePermissions(Permissions.GovernanceDashboardRead) dashboard(){return this.governance.dashboard();}
  @Get('policies') @RequirePermissions(Permissions.GovernanceRead) policies(){return this.governance.listPolicies();}
  @Post('policies') @RequirePermissions(Permissions.GovernanceWrite) createPolicy(@Body() body:CreatePolicyDto){return this.governance.createPolicy(body);}
  @Patch('policies/:id') @RequirePermissions(Permissions.GovernanceWrite) updatePolicy(@Param('id') id:string,@Body() body:UpdatePolicyDto){return this.governance.updatePolicy(id,body);}
  @Get('decisions') @RequirePermissions(Permissions.GovernanceRead) decisions(){return this.governance.listDecisions();}
  @Post('decisions') @RequirePermissions(Permissions.GovernanceWrite) createDecision(@Body() body:CreateDecisionDto){return this.governance.createDecision(body);}
  @Patch('decisions/:id/decision') @RequirePermissions(Permissions.GovernanceApprove) decide(@Param('id') id:string,@Body() body:DecideDecisionDto){return this.governance.decideDecision(id,body);}
  @Get('risks') @RequirePermissions(Permissions.RiskRead) risks(){return this.governance.listRisks();}
  @Post('risks') @RequirePermissions(Permissions.RiskWrite) createRisk(@Body() body:CreateRiskDto){return this.governance.createRisk(body);}
  @Patch('risks/:id') @RequirePermissions(Permissions.RiskWrite) updateRisk(@Param('id') id:string,@Body() body:UpdateRiskDto){return this.governance.updateRisk(id,body);}
  @Get('compliance/rules') @RequirePermissions(Permissions.ComplianceRead) rules(){return this.governance.listComplianceRules();}
  @Post('compliance/rules') @RequirePermissions(Permissions.ComplianceWrite) createRule(@Body() body:CreateComplianceRuleDto){return this.governance.createComplianceRule(body);}
  @Get('compliance/assessments') @RequirePermissions(Permissions.ComplianceRead) assessments(){return this.governance.listAssessments();}
  @Post('compliance/assessments') @RequirePermissions(Permissions.ComplianceWrite) createAssessment(@Body() body:CreateAssessmentDto){return this.governance.createAssessment(body);}
  @Get('changes') @RequirePermissions(Permissions.ChangeRead) changes(){return this.governance.listChanges();}
  @Post('changes') @RequirePermissions(Permissions.ChangeWrite) createChange(@Body() body:CreateChangeRequestDto){return this.governance.createChange(body);}
  @Patch('changes/:id/transition') @RequirePermissions(Permissions.ChangeApprove) transition(@Param('id') id:string,@Body() body:TransitionChangeDto){return this.governance.transitionChange(id,body);}
}
