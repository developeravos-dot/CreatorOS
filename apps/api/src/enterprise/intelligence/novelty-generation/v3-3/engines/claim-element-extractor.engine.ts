import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { DraftPatentClaim } from '../../v3/models/novelty-v3.models';
import type { ExtractedClaimElement } from '../models/novelty-v3-3.models';

@Injectable()
export class ClaimElementExtractorEngine {
  extract(
    claims: DraftPatentClaim[],
  ): ExtractedClaimElement[] {
    const output: ExtractedClaimElement[] = [];

    for (const claim of claims) {
      const segments = this.segments(claim);

      for (const segment of segments) {
        output.push({
          id: randomUUID(),
          claimNumber: claim.claimNumber,
          claimType: claim.type,
          category: this.category(segment),
          text: segment,
          normalizedText: this.normalize(segment),
          essential:
            claim.type !== 'dependent' ||
            this.isEssential(segment),
          supportReferences:
            claim.supportElements.filter(
              (support) =>
                this.overlaps(
                  support,
                  segment,
                ),
            ),
        });
      }
    }

    return this.unique(output);
  }

  private segments(
    claim: DraftPatentClaim,
  ): string[] {
    const textSegments = claim.text
      .split(/[؛;.]/)
      .flatMap((part) =>
        part.split(/، حيث|، بحيث|، يشتمل|، تشمل|، ويتضمن/),
      )
      .map((part) => part.trim())
      .filter((part) => part.length >= 8);

    return [
      ...new Set([
        ...textSegments,
        ...claim.supportElements
          .map((value) => value.trim())
          .filter(Boolean),
      ]),
    ];
  }

  private category(
    value: string,
  ): ExtractedClaimElement['category'] {
    const text = value.toLowerCase();

    if (
      text.includes('محرك') ||
      text.includes('واجهة') ||
      text.includes('نظام') ||
      text.includes('وحدة')
    ) {
      return 'system-component';
    }

    if (
      text.includes('استقبال') ||
      text.includes('مدخل') ||
      text.includes('طلبات') ||
      text.includes('بيانات')
    ) {
      return 'input';
    }

    if (
      text.includes('حساب') ||
      text.includes('توليد') ||
      text.includes('اختيار') ||
      text.includes('تحليل') ||
      text.includes('تخصيص') ||
      text.includes('تكوين')
    ) {
      return 'processing-step';
    }

    if (
      text.includes('ينتج') ||
      text.includes('مخرج') ||
      text.includes('درجة') ||
      text.includes('مجموعة قابلة')
    ) {
      return 'output';
    }

    if (
      text.includes('شرط') ||
      text.includes('قيد') ||
      text.includes('حد أدنى') ||
      text.includes('وفق')
    ) {
      return 'constraint';
    }

    if (
      text.includes('تقليل') ||
      text.includes('زيادة') ||
      text.includes('تحسين') ||
      text.includes('يحقق')
    ) {
      return 'technical-effect';
    }

    if (
      text.includes('مرتبط') ||
      text.includes('يعتمد') ||
      text.includes('بين') ||
      text.includes('لكل عضو')
    ) {
      return 'relationship';
    }

    return 'unknown';
  }

  private isEssential(value: string): boolean {
    const text = value.toLowerCase();

    return [
      'محرك',
      'تكوين',
      'تخصيص',
      'إعادة توزيع',
      'قيود',
      'مجموعة شراء',
    ].some((term) => text.includes(term));
  }

  private unique(
    elements: ExtractedClaimElement[],
  ): ExtractedClaimElement[] {
    const seen = new Set<string>();
    const output: ExtractedClaimElement[] = [];

    for (const element of elements) {
      const key =
        `${element.claimNumber}:` +
        `${element.normalizedText}`;

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      output.push(element);
    }

    return output;
  }

  private overlaps(
    left: string,
    right: string,
  ): boolean {
    const leftTokens = this.tokens(left);
    const rightTokens = this.tokens(right);

    let matches = 0;

    for (const token of leftTokens) {
      if (rightTokens.has(token)) {
        matches += 1;
      }
    }

    return matches >= 2;
  }

  private tokens(value: string): Set<string> {
    return new Set(
      this.normalize(value)
        .split(' ')
        .filter((token) => token.length >= 3),
    );
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
