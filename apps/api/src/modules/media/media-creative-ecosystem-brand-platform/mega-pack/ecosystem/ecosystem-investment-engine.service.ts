import { Injectable } from '@nestjs/common';

@Injectable()
export class EcosystemInvestmentEngineService {
  allocate(totalBudget: number) {
    const budget = Math.max(0, totalBudget);

    return {
      totalBudget: budget,
      allocations: {
        research: Math.round(budget * 0.08),
        innovation: Math.round(budget * 0.1),
        production: Math.round(budget * 0.28),
        brand: Math.round(budget * 0.12),
        publishing: Math.round(budget * 0.08),
        growth: Math.round(budget * 0.14),
        localization: Math.round(budget * 0.06),
        technology: Math.round(budget * 0.06),
        riskAndCompliance: Math.round(budget * 0.03),
        reserve: Math.round(budget * 0.05),
      },
      priorityQueue: [
        'core-IP-validation',
        'brand-system',
        'production-pilot',
        'distribution-pilot',
        'growth-experiment',
        'language-expansion',
        'product-expansion',
        'licensing-expansion',
      ],
      blockedAllocations: [],
    };
  }
}