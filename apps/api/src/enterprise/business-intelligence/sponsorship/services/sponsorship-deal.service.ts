import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateInvoiceDto,
  CreateSponsorshipDealDto,
} from '../dto/sponsorship-deal.dto';
import {
  SponsorshipDeal,
  SponsorshipDealStatus,
  SponsorshipDeliverableStatus,
  SponsorshipInvoice,
} from '../models/sponsorship-deal.models';
import { SponsorshipDealRepository } from '../repositories/sponsorship-deal.repository';

@Injectable()
export class SponsorshipDealService {
  constructor(
    private readonly repository: SponsorshipDealRepository,
  ) {}

  status() {
    return {
      success: true,
      system:
        'CreatorOS Sponsorship Deal, Contract & Revenue Operations',
      megaPack: '1C',
      status: 'operational',
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      autonomousContracting: false,
      autonomousPayments: false,
      components: {
        dealManagement: true,
        proposalApproval: true,
        negotiationTracking: true,
        contractApproval: true,
        deliverableTracking: true,
        invoiceManagement: true,
        paymentCollectionTracking: true,
        revenueDashboard: true,
      },
      metrics: {
        deals: this.repository.countDeals(),
        invoices: this.repository.countInvoices(),
      },
    };
  }

  createDeal(
    input: CreateSponsorshipDealDto,
  ): SponsorshipDeal {
    const milestoneTotal = input.paymentMilestones.reduce(
      (sum, milestone) => sum + milestone.percentage,
      0,
    );

    if (Math.round(milestoneTotal) !== 100) {
      throw new BadRequestException(
        'Payment milestone percentages must total 100.',
      );
    }

    const now = new Date().toISOString();

    const deal: SponsorshipDeal = {
      dealId: randomUUID(),
      sponsorId: input.sponsorId,
      companyName: input.companyName,
      leadId: input.leadId,
      opportunityId: input.opportunityId,
      status: 'draft',
      campaignName: input.campaignName,
      totalValue: input.proposedValue,
      proposedValue: input.proposedValue,
      minimumAcceptableValue:
        input.minimumAcceptableValue,
      currency: input.currency,
      negotiationRound: 0,
      deliverables: input.deliverables.map(
        (deliverable) => ({
          deliverableId: randomUUID(),
          ...deliverable,
          status: 'planned',
        }),
      ),
      paymentMilestones: input.paymentMilestones.map(
        (milestone) => ({
          milestoneId: randomUUID(),
          title: milestone.title,
          percentage: milestone.percentage,
          amount:
            Math.round(
              input.proposedValue *
                (milestone.percentage / 100) *
                100,
            ) / 100,
          currency: input.currency,
          dueDate: milestone.dueDate,
          paidAmount: 0,
        }),
      ),
      proposalApproved: false,
      contractApproved: false,
      contractSigned: false,
      requiresHumanApproval: true,
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.saveDeal(deal);
  }

  listDeals(): SponsorshipDeal[] {
    return this.repository.findDeals();
  }

  getDeal(dealId: string): SponsorshipDeal {
    const deal = this.repository.findDealById(dealId);

    if (!deal) {
      throw new NotFoundException(
        `Sponsorship deal ${dealId} was not found.`,
      );
    }

    return deal;
  }

  updateStatus(
    dealId: string,
    status: SponsorshipDealStatus,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    const updated: SponsorshipDeal = {
      ...deal,
      status,
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  recordNegotiation(
    dealId: string,
    proposedValue: number,
    note?: string,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    if (proposedValue < deal.minimumAcceptableValue) {
      throw new BadRequestException(
        'Proposed value is below the minimum acceptable value.',
      );
    }

    const updated: SponsorshipDeal = {
      ...deal,
      proposedValue,
      totalValue: proposedValue,
      status: 'negotiating',
      negotiationRound: deal.negotiationRound + 1,
      notes: note
        ? [...deal.notes, note]
        : deal.notes,
      paymentMilestones: deal.paymentMilestones.map(
        (milestone) => ({
          ...milestone,
          amount:
            Math.round(
              proposedValue *
                (milestone.percentage / 100) *
                100,
            ) / 100,
        }),
      ),
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  approveProposal(
    dealId: string,
    approved: boolean,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    const updated: SponsorshipDeal = {
      ...deal,
      proposalApproved: approved,
      status: approved
        ? 'proposal_approved'
        : 'proposal_ready',
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  approveContract(
    dealId: string,
    approved: boolean,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    if (!deal.proposalApproved) {
      throw new BadRequestException(
        'Proposal must be approved before contract approval.',
      );
    }

    const updated: SponsorshipDeal = {
      ...deal,
      contractApproved: approved,
      status: approved
        ? 'contract_approved'
        : 'contract_ready',
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  signContract(
    dealId: string,
    signed: boolean,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    if (!deal.contractApproved) {
      throw new BadRequestException(
        'Contract must be approved before signing.',
      );
    }

    const updated: SponsorshipDeal = {
      ...deal,
      contractSigned: signed,
      agreedValue: signed
        ? deal.proposedValue
        : deal.agreedValue,
      status: signed ? 'signed' : 'contract_approved',
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  updateDeliverableStatus(
    dealId: string,
    deliverableId: string,
    status: SponsorshipDeliverableStatus,
  ): SponsorshipDeal {
    const deal = this.getDeal(dealId);

    const exists = deal.deliverables.some(
      (item) => item.deliverableId === deliverableId,
    );

    if (!exists) {
      throw new NotFoundException(
        `Deliverable ${deliverableId} was not found.`,
      );
    }

    const deliverables = deal.deliverables.map(
      (deliverable) =>
        deliverable.deliverableId === deliverableId
          ? { ...deliverable, status }
          : deliverable,
    );

    const allPublished = deliverables.every(
      (deliverable) =>
        ['published', 'cancelled'].includes(
          deliverable.status,
        ),
    );

    const updated: SponsorshipDeal = {
      ...deal,
      deliverables,
      status: allPublished ? 'completed' : 'in_delivery',
      updatedAt: new Date().toISOString(),
    };

    return this.repository.saveDeal(updated);
  }

  createInvoice(
    input: CreateInvoiceDto,
  ): SponsorshipInvoice {
    const deal = this.getDeal(input.dealId);

    if (!deal.contractSigned) {
      throw new BadRequestException(
        'Contract must be signed before invoicing.',
      );
    }

    const now = new Date().toISOString();

    const invoice: SponsorshipInvoice = {
      invoiceId: randomUUID(),
      dealId: deal.dealId,
      invoiceNumber: `INV-${Date.now()}`,
      sponsorId: deal.sponsorId,
      companyName: deal.companyName,
      amount: input.amount,
      currency: deal.currency,
      paidAmount: 0,
      remainingAmount: input.amount,
      issueDate: now,
      dueDate: input.dueDate,
      status: 'issued',
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    this.updateStatus(deal.dealId, 'invoiced');

    return this.repository.saveInvoice(invoice);
  }

  listInvoices(): SponsorshipInvoice[] {
    return this.repository.findInvoices();
  }

  recordPayment(
    invoiceId: string,
    amount: number,
  ): SponsorshipInvoice {
    const invoice =
      this.repository.findInvoiceById(invoiceId);

    if (!invoice) {
      throw new NotFoundException(
        `Invoice ${invoiceId} was not found.`,
      );
    }

    const paidAmount = Math.min(
      invoice.amount,
      invoice.paidAmount + amount,
    );

    const remainingAmount =
      Math.round((invoice.amount - paidAmount) * 100) /
      100;

    const updated: SponsorshipInvoice = {
      ...invoice,
      paidAmount,
      remainingAmount,
      status:
        remainingAmount === 0
          ? 'paid'
          : 'partially_paid',
      updatedAt: new Date().toISOString(),
    };

    this.repository.saveInvoice(updated);

    this.updateStatus(
      invoice.dealId,
      remainingAmount === 0
        ? 'paid'
        : 'partially_paid',
    );

    return updated;
  }

  dashboard() {
    const deals = this.repository.findDeals();
    const invoices = this.repository.findInvoices();

    const pipelineValue = deals
      .filter(
        (deal) =>
          !['cancelled', 'lost'].includes(deal.status),
      )
      .reduce(
        (sum, deal) =>
          sum + (deal.agreedValue ?? deal.proposedValue),
        0,
      );

    const invoicedValue = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

    const collectedValue = invoices.reduce(
      (sum, invoice) => sum + invoice.paidAmount,
      0,
    );

    return {
      success: true,
      system:
        'CreatorOS Sponsorship Deal, Contract & Revenue Operations',
      megaPack: '1C',
      metrics: {
        totalDeals: deals.length,
        activeDeals: deals.filter(
          (deal) =>
            !['paid', 'cancelled', 'lost'].includes(
              deal.status,
            ),
        ).length,
        signedDeals: deals.filter(
          (deal) => deal.contractSigned,
        ).length,
        completedDeals: deals.filter(
          (deal) =>
            ['completed', 'invoiced', 'paid'].includes(
              deal.status,
            ),
        ).length,
        pipelineValue:
          Math.round(pipelineValue * 100) / 100,
        invoicedValue:
          Math.round(invoicedValue * 100) / 100,
        collectedValue:
          Math.round(collectedValue * 100) / 100,
        outstandingValue:
          Math.round(
            (invoicedValue - collectedValue) * 100,
          ) / 100,
      },
      deals,
      invoices,
      humanFinalAuthority: true,
    };
  }
}
