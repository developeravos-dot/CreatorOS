import { Injectable } from '@nestjs/common';
import {
  SponsorshipDeal,
  SponsorshipInvoice,
} from '../models/sponsorship-deal.models';

@Injectable()
export class SponsorshipDealRepository {
  private readonly deals = new Map<string, SponsorshipDeal>();
  private readonly invoices = new Map<string, SponsorshipInvoice>();

  saveDeal(deal: SponsorshipDeal): SponsorshipDeal {
    this.deals.set(deal.dealId, deal);
    return deal;
  }

  findDeals(): SponsorshipDeal[] {
    return Array.from(this.deals.values()).sort(
      (left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
    );
  }

  findDealById(dealId: string): SponsorshipDeal | undefined {
    return this.deals.get(dealId);
  }

  saveInvoice(invoice: SponsorshipInvoice): SponsorshipInvoice {
    this.invoices.set(invoice.invoiceId, invoice);
    return invoice;
  }

  findInvoices(): SponsorshipInvoice[] {
    return Array.from(this.invoices.values()).sort(
      (left, right) =>
        right.issueDate.localeCompare(left.issueDate),
    );
  }

  findInvoiceById(
    invoiceId: string,
  ): SponsorshipInvoice | undefined {
    return this.invoices.get(invoiceId);
  }

  countDeals(): number {
    return this.deals.size;
  }

  countInvoices(): number {
    return this.invoices.size;
  }
}
