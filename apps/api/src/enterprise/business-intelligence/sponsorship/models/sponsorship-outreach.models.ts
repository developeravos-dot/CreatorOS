export type SponsorshipLeadStatus =
  | 'discovered'
  | 'enriched'
  | 'qualified'
  | 'draft_ready'
  | 'approved'
  | 'contacted'
  | 'replied'
  | 'meeting_requested'
  | 'negotiating'
  | 'converted'
  | 'rejected'
  | 'archived';

export type SponsorshipOutreachPriority =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low';

export type SponsorshipContactChannel =
  | 'email'
  | 'linkedin'
  | 'website'
  | 'instagram'
  | 'other';

export interface SponsorshipContact {
  contactId: string;
  sponsorId: string;
  fullName?: string;
  role?: string;
  email?: string;
  linkedInUrl?: string;
  websiteUrl?: string;
  preferredChannel: SponsorshipContactChannel;
  confidenceScore: number;
  verified: boolean;
}

export interface SponsorshipLead {
  leadId: string;
  sponsorId: string;
  companyName: string;
  opportunityId?: string;
  status: SponsorshipLeadStatus;
  priority: SponsorshipOutreachPriority;
  opportunityScore: number;
  estimatedValue: number;
  currency: string;
  contact?: SponsorshipContact;
  reasons: string[];
  nextBestAction: string;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipOutreachDraft {
  draftId: string;
  leadId: string;
  sponsorId: string;
  companyName: string;
  channelName: string;
  subject: string;
  openingLine: string;
  message: string;
  callToAction: string;
  personalizationPoints: string[];
  complianceWarnings: string[];
  approved: boolean;
  sent: boolean;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipOutreachMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  draftsReady: number;
  contacted: number;
  replied: number;
  meetingsRequested: number;
  converted: number;
  estimatedPipelineValue: number;
  replyRate: number;
  conversionRate: number;
}
