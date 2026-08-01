import { Injectable } from '@nestjs/common';

interface DailyUsageState {
  date: string;
  requests: number;
  estimatedCostUsd: number;
}

@Injectable()
export class IntelligenceCostGateService {
  private state: DailyUsageState = {
    date: this.getDateKey(),
    requests: 0,
    estimatedCostUsd: 0,
  };

  private getDateKey(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private refreshDay(): void {
    const currentDate = this.getDateKey();

    if (this.state.date !== currentDate) {
      this.state = {
        date: currentDate,
        requests: 0,
        estimatedCostUsd: 0,
      };
    }
  }

  isOpenAiEnabled(): boolean {
    return String(process.env.OPENAI_ENABLED ?? 'false').toLowerCase() === 'true';
  }

  canUsePaidProvider(explicitPermission = false): {
    allowed: boolean;
    reason?: string;
  } {
    this.refreshDay();

    if (!this.isOpenAiEnabled()) {
      return {
        allowed: false,
        reason: 'OpenAI is disabled by OPENAI_ENABLED=false',
      };
    }

    if (!explicitPermission) {
      return {
        allowed: false,
        reason: 'Paid provider permission was not granted for this request',
      };
    }

    const dailyRequestLimit = Number(
      process.env.OPENAI_DAILY_REQUEST_LIMIT ?? 10,
    );

    const dailyBudgetUsd = Number(
      process.env.OPENAI_DAILY_BUDGET_USD ?? 1,
    );

    if (this.state.requests >= dailyRequestLimit) {
      return {
        allowed: false,
        reason: 'OpenAI daily request limit reached',
      };
    }

    if (this.state.estimatedCostUsd >= dailyBudgetUsd) {
      return {
        allowed: false,
        reason: 'OpenAI daily budget reached',
      };
    }

    return { allowed: true };
  }

  registerPaidUsage(estimatedCostUsd: number): void {
    this.refreshDay();

    this.state.requests += 1;
    this.state.estimatedCostUsd += Math.max(0, estimatedCostUsd);
  }

  getStatus() {
    this.refreshDay();

    return {
      openAiEnabled: this.isOpenAiEnabled(),
      dailyRequestLimit: Number(
        process.env.OPENAI_DAILY_REQUEST_LIMIT ?? 10,
      ),
      dailyBudgetUsd: Number(
        process.env.OPENAI_DAILY_BUDGET_USD ?? 1,
      ),
      usage: { ...this.state },
    };
  }
}
