import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../persistence/prisma.service';
import { GovernanceRiskLevel, GovernanceDecisionStatus, GovernanceChangeStatus } from '../../../generated/prisma/enums';
import { CreateAssessmentDto, CreateChangeRequestDto, CreateComplianceRuleDto, CreateDecisionDto, CreatePolicyDto, CreateRiskDto, DecideDecisionDto, TransitionChangeDto, UpdatePolicyDto, UpdateRiskDto } from './dto/governance.dto';

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async audit(action: string, resourceType: string, resourceId?: string, payload?: object) {
    await this.prisma.auditLog.create({ data: { eventType: `governance.${action}`, actorType: 'SYSTEM', resourceType, resourceId, action, payload: payload ?? undefined } });
  }
  private riskLevel(score: number): GovernanceRiskLevel {
    if (score >= 20) return GovernanceRiskLevel.CRITICAL;
    if (score >= 12) return GovernanceRiskLevel.HIGH;
    if (score >= 6) return GovernanceRiskLevel.MEDIUM;
    return GovernanceRiskLevel.LOW;
  }
  private conflict(error: unknown): never {
    if ((error as { code?: string }).code === 'P2002') throw new ConflictException('A governance record with this key already exists.');
    throw error;
  }

  async dashboard() {
    const [policies, activePolicies, decisions, pendingDecisions, risks, criticalRisks, rules, nonCompliant, changes, pendingChanges] = await Promise.all([
      this.prisma.governancePolicy.count(), this.prisma.governancePolicy.count({ where: { status: 'ACTIVE' } }),
      this.prisma.governanceDecision.count(), this.prisma.governanceDecision.count({ where: { status: 'PROPOSED' } }),
      this.prisma.governanceRisk.count(), this.prisma.governanceRisk.count({ where: { level: 'CRITICAL', status: { not: 'CLOSED' } } }),
      this.prisma.governanceComplianceRule.count({ where: { active: true } }), this.prisma.governanceAssessment.count({ where: { status: 'NON_COMPLIANT' } }),
      this.prisma.governanceChangeRequest.count(), this.prisma.governanceChangeRequest.count({ where: { status: { in: ['SUBMITTED', 'APPROVED'] } } }),
    ]);
    return { policies, activePolicies, decisions, pendingDecisions, risks, criticalRisks, activeComplianceRules: rules, nonCompliantAssessments: nonCompliant, changes, pendingChanges };
  }

  listPolicies() { return this.prisma.governancePolicy.findMany({ orderBy: { updatedAt: 'desc' } }); }
  async createPolicy(input: CreatePolicyDto) { try { const row = await this.prisma.governancePolicy.create({ data: { ...input, effectiveAt: input.effectiveAt ? new Date(input.effectiveAt) : undefined } }); await this.audit('policy.created','GovernancePolicy',row.id,{ policyKey: row.policyKey }); return row; } catch(e){ this.conflict(e); } }
  async updatePolicy(id: string, input: UpdatePolicyDto) { const found=await this.prisma.governancePolicy.findUnique({where:{id}}); if(!found) throw new NotFoundException('Policy not found.'); const row=await this.prisma.governancePolicy.update({where:{id},data:{...input,effectiveAt:input.effectiveAt?new Date(input.effectiveAt):undefined,version: input.rules ? {increment:1}:undefined,retiredAt: input.status==='RETIRED'?new Date():undefined}}); await this.audit('policy.updated','GovernancePolicy',id,{status:row.status}); return row; }

  listDecisions() { return this.prisma.governanceDecision.findMany({ orderBy: { createdAt: 'desc' } }); }
  async createDecision(input: CreateDecisionDto) { try { const row=await this.prisma.governanceDecision.create({data:input}); await this.audit('decision.created','GovernanceDecision',row.id,{decisionKey:row.decisionKey}); return row;} catch(e){this.conflict(e);} }
  async decideDecision(id:string,input:DecideDecisionDto){ if(![GovernanceDecisionStatus.APPROVED,GovernanceDecisionStatus.REJECTED,GovernanceDecisionStatus.SUPERSEDED].includes(input.status)) throw new ConflictException('Decision transition must be APPROVED, REJECTED, or SUPERSEDED.'); const found=await this.prisma.governanceDecision.findUnique({where:{id}}); if(!found) throw new NotFoundException('Decision not found.'); const row=await this.prisma.governanceDecision.update({where:{id},data:{status:input.status,approvedBy:input.approvedBy,decidedAt:new Date()}}); await this.audit('decision.decided','GovernanceDecision',id,{status:row.status}); return row; }

  listRisks() { return this.prisma.governanceRisk.findMany({ orderBy: [{ level: 'desc' }, { updatedAt: 'desc' }] }); }
  async createRisk(input:CreateRiskDto){ try{const score=input.likelihood*input.impact; const row=await this.prisma.governanceRisk.create({data:{...input,score,level:this.riskLevel(score),reviewAt:input.reviewAt?new Date(input.reviewAt):undefined}}); await this.audit('risk.created','GovernanceRisk',row.id,{score,level:row.level}); return row;}catch(e){this.conflict(e);} }
  async updateRisk(id:string,input:UpdateRiskDto){const found=await this.prisma.governanceRisk.findUnique({where:{id}});if(!found)throw new NotFoundException('Risk not found.'); const likelihood=input.likelihood??found.likelihood, impact=input.impact??found.impact, score=likelihood*impact; const row=await this.prisma.governanceRisk.update({where:{id},data:{...input,score,level:this.riskLevel(score),reviewAt:input.reviewAt?new Date(input.reviewAt):undefined,closedAt:input.status==='CLOSED'?new Date():undefined}});await this.audit('risk.updated','GovernanceRisk',id,{score,level:row.level,status:row.status});return row;}

  listComplianceRules(){return this.prisma.governanceComplianceRule.findMany({orderBy:[{framework:'asc'},{ruleKey:'asc'}]});}
  async createComplianceRule(input:CreateComplianceRuleDto){try{const row=await this.prisma.governanceComplianceRule.create({data:input});await this.audit('compliance-rule.created','GovernanceComplianceRule',row.id,{ruleKey:row.ruleKey});return row;}catch(e){this.conflict(e);}}
  listAssessments(){return this.prisma.governanceAssessment.findMany({include:{policy:true,risk:true,rule:true},orderBy:{assessedAt:'desc'}});}
  async createAssessment(input:CreateAssessmentDto){const row=await this.prisma.governanceAssessment.create({data:{...input,nextReviewAt:input.nextReviewAt?new Date(input.nextReviewAt):undefined}});await this.audit('assessment.created','GovernanceAssessment',row.id,{status:row.status,subjectType:row.subjectType});return row;}

  listChanges(){return this.prisma.governanceChangeRequest.findMany({orderBy:{updatedAt:'desc'}});}
  async createChange(input:CreateChangeRequestDto){try{const row=await this.prisma.governanceChangeRequest.create({data:input});await this.audit('change.created','GovernanceChangeRequest',row.id,{changeKey:row.changeKey});return row;}catch(e){this.conflict(e);}}
  async transitionChange(id:string,input:TransitionChangeDto){const found=await this.prisma.governanceChangeRequest.findUnique({where:{id}});if(!found)throw new NotFoundException('Change request not found.'); const allowed:Record<string,GovernanceChangeStatus[]>={DRAFT:[GovernanceChangeStatus.SUBMITTED,GovernanceChangeStatus.CANCELLED],SUBMITTED:[GovernanceChangeStatus.APPROVED,GovernanceChangeStatus.REJECTED,GovernanceChangeStatus.CANCELLED],APPROVED:[GovernanceChangeStatus.IMPLEMENTED,GovernanceChangeStatus.CANCELLED],REJECTED:[],IMPLEMENTED:[],CANCELLED:[]}; const transitions = allowed[found.status] ?? []; if(!transitions.includes(input.status)) throw new ConflictException(`Invalid change transition: ${found.status} -> ${input.status}`); const now=new Date(); const row=await this.prisma.governanceChangeRequest.update({where:{id},data:{status:input.status,submittedAt:input.status==='SUBMITTED'?now:undefined,decidedAt:['APPROVED','REJECTED'].includes(input.status)?now:undefined,implementedAt:input.status==='IMPLEMENTED'?now:undefined,approvedBy:input.status==='APPROVED'?input.actor:undefined,implementedBy:input.status==='IMPLEMENTED'?input.actor:undefined}});await this.audit('change.transitioned','GovernanceChangeRequest',id,{from:found.status,to:row.status});return row;}
}
