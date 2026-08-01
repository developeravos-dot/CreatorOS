export type SponsorshipDealStatus =
  | 'draft'
  | 'proposal_ready'
  | 'proposal_approved'
  | 'sent'
  | 'negotiating'
  | 'verbally_agreed'
  | 'contract_ready'
  | 'contract_approved'
  | 'signed'
  | 'in_delivery'
  | 'completed'
  | 'invoiced'
  | 'partially_paid'
  | 'paid'
  | 'cancelled'
  | 'lost';

export type SponsorshipDeliverableStatus =
  | 'planned'
  | 'in_progress'
  | 'submitted'
  | 'revision_requested'
  | 'approved'
  | 'published'
  | 'cancelled';

export type SponsorshipInvoiceStatus =
  | 'draft'
  | 'issued'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface SponsorshipDeliverable {
  deliverableId: string;
  title: string;
  description?: string;
  platform: string;
  format: string;
  quantity: number;
  dueDate?: string;
  status: SponsorshipDeliverableStatus;
  agreedValue: number;
  currency: string;
}

export interface SponsorshipPaymentMilestone {
  milestoneId: string;
  title: string;
  percentage: number;
  amount: number;
  currency: string;
  dueDate?: string;
  paidAmount: number;
  paidAt?: string;
}

export interface SponsorshipDeal {
  dealId: string;
  sponsorId: string;
  companyName: string;
  leadId?: string;
  opportunityId?: string;
  status: SponsorshipDealStatus;
  campaignName: string;
  totalValue: number;
  currency: string;
  minimumAcceptableValue: number;
  proposedValue: number;
  agreedValue?: number;
  negotiationRound: number;
  deliverables: SponsorshipDeliverable[];
  paymentMilestones: SponsorshipPaymentMilestone[];
  proposalApproved: boolean;
  contractApproved: boolean;
  contractSigned: boolean;
  requiresHumanApproval: boolean;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipInvoice {
  invoiceId: string;
  dealId: string;
  invoiceNumber: string;
  sponsorId: string;
  companyName: string;
  amount: number;
  currency: string;
  paidAmount: number;
  remainingAmount: number;
  issueDate: string;
  dueDate: string;
  status: SponsorshipInvoiceStatus;
  requiresHumanApproval: boolean;
  createdAt: string;
  updatedAt: string;
}
