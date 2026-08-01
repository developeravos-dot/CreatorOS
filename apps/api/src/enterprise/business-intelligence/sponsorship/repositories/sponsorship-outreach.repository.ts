import { Injectable } from '@nestjs/common';
import {
  SponsorshipLead,
  SponsorshipLeadStatus,
  SponsorshipOutreachDraft,
} from '../models/sponsorship-outreach.models';

@Injectable()
export class SponsorshipOutreachRepository {
  private readonly leads = new Map<string, SponsorshipLead>();

  private readonly drafts = new Map<
    string,
    SponsorshipOutreachDraft
  >();

  saveLead(lead: SponsorshipLead): SponsorshipLead {
    this.leads.set(lead.leadId, lead);
    return lead;
  }

  findLeads(): SponsorshipLead[] {
    return Array.from(this.leads.values()).sort(
      (left, right) => {
        if (right.opportunityScore !== left.opportunityScore) {
          return right.opportunityScore - left.opportunityScore;
        }

        return right.estimatedValue - left.estimatedValue;
      },
    );
  }

  findLeadById(
    leadId: string,
  ): SponsorshipLead | undefined {
    return this.leads.get(leadId);
  }

  updateLeadStatus(
    leadId: string,
    status: SponsorshipLeadStatus,
  ): SponsorshipLead | undefined {
    const current = this.leads.get(leadId);

    if (!current) {
      return undefined;
    }

    const updated: SponsorshipLead = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.leads.set(leadId, updated);

    return updated;
  }

  saveDraft(
    draft: SponsorshipOutreachDraft,
  ): SponsorshipOutreachDraft {
    this.drafts.set(draft.draftId, draft);
    return draft;
  }

  findDrafts(): SponsorshipOutreachDraft[] {
    return Array.from(this.drafts.values()).sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt),
    );
  }

  findDraftById(
    draftId: string,
  ): SponsorshipOutreachDraft | undefined {
    return this.drafts.get(draftId);
  }

  approveDraft(
    draftId: string,
    approved: boolean,
  ): SponsorshipOutreachDraft | undefined {
    const current = this.drafts.get(draftId);

    if (!current) {
      return undefined;
    }

    const updated: SponsorshipOutreachDraft = {
      ...current,
      approved,
      updatedAt: new Date().toISOString(),
    };

    this.drafts.set(draftId, updated);

    return updated;
  }

  countLeads(): number {
    return this.leads.size;
  }

  countDrafts(): number {
    return this.drafts.size;
  }
}
