import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  SecurityEvent,
  SecurityPolicy,
} from '../trust-security.types';

@Injectable()
export class SecurityPlatformService {
  private readonly events: SecurityEvent[] = [];
  private readonly policies = new Map<
    string,
    SecurityPolicy
  >();

  upsertPolicy(input: {
    key: string;
    name: string;
    enabled: boolean;
    rules: Record<string, unknown>;
  }) {
    const existing = this.policies.get(input.key);
    const now = new Date().toISOString();

    const policy: SecurityPolicy = {
      id: existing?.id ?? randomUUID(),
      ...input,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.policies.set(policy.key, policy);
    return policy;
  }

  recordEvent(input: {
    type: SecurityEvent['type'];
    severity: SecurityEvent['severity'];
    source: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) {
    const event: SecurityEvent = {
      id: randomUUID(),
      ...input,
      metadata: input.metadata ?? {},
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);
    return event;
  }

  evaluateRisk() {
    const critical = this.events.filter(
      (event) => event.severity === 'critical',
    ).length;

    const high = this.events.filter(
      (event) => event.severity === 'high',
    ).length;

    return {
      risk:
        critical > 0
          ? 'critical'
          : high > 0
            ? 'high'
            : 'normal',
      criticalEvents: critical,
      highEvents: high,
      totalEvents: this.events.length,
      activePolicies: [...this.policies.values()].filter(
        (policy) => policy.enabled,
      ).length,
    };
  }

  listEvents() {
    return [...this.events];
  }

  listPolicies() {
    return [...this.policies.values()];
  }
}