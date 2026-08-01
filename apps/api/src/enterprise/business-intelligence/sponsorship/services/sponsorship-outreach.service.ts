import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateSponsorshipLeadDto,
  GenerateOutreachDraftDto,
} from '../dto/sponsorship-outreach.dto';
import { SponsorshipLeadQualificationEngine } from '../engines/sponsorship-lead-qualification.engine';
import { SponsorshipOutreachGenerationEngine } from '../engines/sponsorship-outreach-generation.engine';
import {
  SponsorshipContact,
  SponsorshipLead,
  SponsorshipLeadStatus,
  SponsorshipOutreachDraft,
  SponsorshipOutreachMetrics,
} from '../models/sponsorship-outreach.models';
import { SponsorshipOutreachRepository } from '../repositories/sponsorship-outreach.repository';

@Injectable()
export class SponsorshipOutreachService {
  constructor(
    private readonly qualificationEngine: SponsorshipLeadQualificationEngine,
    private readonly generationEngine: SponsorshipOutreachGenerationEngine,
    private readonly repository: SponsorshipOutreachRepository,
  ) {}

  status() {
    return {
      success: true,
      system:
        'CreatorOS Sponsorship Acquisition & Outreach Intelligence',
      megaPack: '1B',
      status: 'operational',
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      autonomousSending: false,
      autonomousContracting: false,
      components: {
        sponsorLeadManagement: true,
        decisionMakerEnrichment: true,
        leadQualification: true,
        outreachPrioritization: true,
        personalizedDraftGeneration: true,
        complianceWarnings: true,
        outreachApprovalGate: true,
        pipelineMetrics: true,
      },
      metrics: {
        leads: this.repository.countLeads(),
        drafts: this.repository.countDrafts(),
      },
    };
  }

  createLead(
    input: CreateSponsorshipLeadDto,
  ): SponsorshipLead {
    const contact = this.buildContact(input);

    const qualification =
      this.qualificationEngine.qualify({
        opportunityScore: input.opportunityScore,
        estimatedValue: input.estimatedValue,
        hasContact: Boolean(contact),
        contactVerified: contact?.verified ?? false,
        contactConfidenceScore:
          contact?.confidenceScore ?? 0,
      });

    const now = new Date().toISOString();

    const status: SponsorshipLeadStatus =
      qualification.qualificationScore >= 50
        ? contact?.verified
          ? 'qualified'
          : contact
            ? 'enriched'
            : 'discovered'
        : 'archived';

    const lead: SponsorshipLead = {
      leadId: randomUUID(),
      sponsorId: input.sponsorId,
      companyName: input.companyName,
      opportunityId: input.opportunityId,
      status,
      priority: qualification.priority,
      opportunityScore: input.opportunityScore,
      estimatedValue: input.estimatedValue,
      currency: input.currency,
      contact,
      reasons: qualification.reasons,
      nextBestAction: qualification.nextBestAction,
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.saveLead(lead);
  }

  listLeads(): SponsorshipLead[] {
    return this.repository.findLeads();
  }

  getLead(leadId: string): SponsorshipLead {
    const lead = this.repository.findLeadById(leadId);

    if (!lead) {
      throw new NotFoundException(
        `Sponsorship lead ${leadId} was not found.`,
      );
    }

    return lead;
  }

  updateLeadStatus(
    leadId: string,
    status: SponsorshipLeadStatus,
  ): SponsorshipLead {
    const lead = this.repository.updateLeadStatus(
      leadId,
      status,
    );

    if (!lead) {
      throw new NotFoundException(
        `Sponsorship lead ${leadId} was not found.`,
      );
    }

    return lead;
  }

  generateDraft(
    input: GenerateOutreachDraftDto,
  ): SponsorshipOutreachDraft {
    const lead = this.getLead(input.leadId);

    if (!lead.contact) {
      throw new BadRequestException(
        'A sponsor contact is required before generating outreach.',
      );
    }

    if (!lead.contact.verified) {
      throw new BadRequestException(
        'The sponsor contact must be verified before generating outreach.',
      );
    }

    const generated = this.generationEngine.generate({
      lead,
      channelId: input.channelId,
      channelName: input.channelName,
      channelCategories: input.channelCategories,
      averageViews: input.averageViews,
      audienceReach: input.audienceReach,
      engagementRate: input.engagementRate,
      audienceCountries: input.audienceCountries,
      audienceLanguages: input.audienceLanguages,
      campaignIdea: input.campaignIdea,
      senderName: input.senderName,
    });

    const now = new Date().toISOString();

    const draft: SponsorshipOutreachDraft = {
      ...generated,
      draftId: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.repository.updateLeadStatus(
      lead.leadId,
      'draft_ready',
    );

    return this.repository.saveDraft(draft);
  }

  listDrafts(): SponsorshipOutreachDraft[] {
    return this.repository.findDrafts();
  }

  getDraft(
    draftId: string,
  ): SponsorshipOutreachDraft {
    const draft = this.repository.findDraftById(draftId);

    if (!draft) {
      throw new NotFoundException(
        `Sponsorship outreach draft ${draftId} was not found.`,
      );
    }

    return draft;
  }

  approveDraft(
    draftId: string,
    approved: boolean,
  ): SponsorshipOutreachDraft {
    const current = this.getDraft(draftId);

    const draft = this.repository.approveDraft(
      draftId,
      approved,
    );

    if (!draft) {
      throw new NotFoundException(
        `Sponsorship outreach draft ${draftId} was not found.`,
      );
    }

    this.repository.updateLeadStatus(
      current.leadId,
      approved ? 'approved' : 'draft_ready',
    );

    return draft;
  }

  dashboard() {
    const leads = this.repository.findLeads();
    const drafts = this.repository.findDrafts();

    const contacted = leads.filter((lead) =>
      [
        'contacted',
        'replied',
        'meeting_requested',
        'negotiating',
        'converted',
      ].includes(lead.status),
    ).length;

    const replied = leads.filter((lead) =>
      [
        'replied',
        'meeting_requested',
        'negotiating',
        'converted',
      ].includes(lead.status),
    ).length;

    const converted = leads.filter(
      (lead) => lead.status === 'converted',
    ).length;

    const estimatedPipelineValue = leads
      .filter(
        (lead) =>
          !['rejected', 'archived'].includes(lead.status),
      )
      .reduce(
        (total, lead) => total + lead.estimatedValue,
        0,
      );

    const metrics: SponsorshipOutreachMetrics = {
      totalLeads: leads.length,
      qualifiedLeads: leads.filter((lead) =>
        [
          'qualified',
          'draft_ready',
          'approved',
          'contacted',
          'replied',
          'meeting_requested',
          'negotiating',
          'converted',
        ].includes(lead.status),
      ).length,
      draftsReady: drafts.filter(
        (draft) => !draft.sent,
      ).length,
      contacted,
      replied,
      meetingsRequested: leads.filter((lead) =>
        [
          'meeting_requested',
          'negotiating',
          'converted',
        ].includes(lead.status),
      ).length,
      converted,
      estimatedPipelineValue:
        Math.round(estimatedPipelineValue * 100) / 100,
      replyRate:
        contacted > 0
          ? Math.round((replied / contacted) * 10000) /
            100
          : 0,
      conversionRate:
        contacted > 0
          ? Math.round((converted / contacted) * 10000) /
            100
          : 0,
    };

    return {
      success: true,
      system:
        'CreatorOS Sponsorship Acquisition & Outreach Intelligence',
      megaPack: '1B',
      metrics,
      priorityLeads: leads.slice(0, 10),
      pendingApprovalDrafts: drafts.filter(
        (draft) => !draft.approved,
      ),
      humanFinalAuthority: true,
    };
  }

  private buildContact(
    input: CreateSponsorshipLeadDto,
  ): SponsorshipContact | undefined {
    const hasContact =
      Boolean(input.contactName) ||
      Boolean(input.contactEmail) ||
      Boolean(input.linkedInUrl) ||
      Boolean(input.websiteUrl);

    if (!hasContact) {
      return undefined;
    }

    return {
      contactId: randomUUID(),
      sponsorId: input.sponsorId,
      fullName: input.contactName,
      role: input.contactRole,
      email: input.contactEmail,
      linkedInUrl: input.linkedInUrl,
      websiteUrl: input.websiteUrl,
      preferredChannel:
        input.preferredChannel ??
        (input.contactEmail ? 'email' : 'website'),
      confidenceScore:
        input.contactConfidenceScore ?? 50,
      verified: input.contactVerified ?? false,
    };
  }
}
