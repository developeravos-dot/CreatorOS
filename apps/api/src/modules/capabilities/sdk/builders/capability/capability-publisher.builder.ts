import type {
  CapabilityPublisherContract,
} from '../../manifest';
import {
  CapabilitySdkBuilderValidationError,
  normalizeText,
} from '../shared';

export class CapabilityPublisherBuilder {
  private publisherName?: string;
  private publisherOrganization?: string;
  private publisherEmail?: string;
  private publisherWebsite?: string;

  name(value: string): this {
    this.publisherName = normalizeText(value);
    return this;
  }

  organization(value: string): this {
    this.publisherOrganization =
      normalizeText(value);

    return this;
  }

  email(value: string): this {
    this.publisherEmail = normalizeText(value);
    return this;
  }

  website(value: string): this {
    this.publisherWebsite =
      normalizeText(value);

    return this;
  }

  build(): CapabilityPublisherContract {
    const issues: string[] = [];

    if (!this.publisherName) {
      issues.push('Publisher name is required.');
    }

    if (
      this.publisherEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        this.publisherEmail,
      )
    ) {
      issues.push('Publisher email is invalid.');
    }

    if (
      this.publisherWebsite &&
      !/^https?:\/\/.+/i.test(
        this.publisherWebsite,
      )
    ) {
      issues.push(
        'Publisher website must use http or https.',
      );
    }

    if (issues.length > 0) {
      throw new CapabilitySdkBuilderValidationError(
        issues,
      );
    }

    return Object.freeze({
      name: this.publisherName!,
      organization:
        this.publisherOrganization,
      email: this.publisherEmail,
      website: this.publisherWebsite,
    });
  }
}