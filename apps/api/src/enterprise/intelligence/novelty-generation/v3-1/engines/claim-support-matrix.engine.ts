import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type {
  DraftPatentClaim,
  InventiveMechanism,
  NoveltyV3Result,
} from '../../v3/models/novelty-v3.models';
import type {
  ClaimSupportItem,
  ClaimSupportMatrixRow,
  PatentEvidenceRecord,
} from '../models/novelty-v3-1.models';

@Injectable()
export class ClaimSupportMatrixEngine {
  build(
    v3: NoveltyV3Result,
    evidence: PatentEvidenceRecord[],
  ): ClaimSupportMatrixRow[] {
    return v3.draftPatentClaims.map(
      (claim) =>
        this.buildRow(
          claim,
          v3,
          evidence,
        ),
    );
  }

  private buildRow(
    claim: DraftPatentClaim,
    v3: NoveltyV3Result,
    evidence: PatentEvidenceRecord[],
  ): ClaimSupportMatrixRow {
    const elements =
      this.extractClaimElements(claim);

    const supportItems: ClaimSupportItem[] = [];

    for (
      const mechanism of
      v3.inventiveMechanisms
    ) {
      const matchingElements =
        elements.filter((element) =>
          this.mechanismSupports(
            mechanism,
            element,
          ),
        );

      if (matchingElements.length === 0) {
        continue;
      }

      supportItems.push({
        supportId: randomUUID(),
        category:
          'technical-mechanism',
        reference: mechanism.name,
        description:
          `يدعم العناصر: ${matchingElements.join('، ')}`,
        supportStrength: this.clamp(
          55 +
            matchingElements.length * 12,
        ),
        evidenceRecordIds: [],
      });
    }

    for (
      const application of
      v3.trizApplications
    ) {
      const matchingElements =
        elements.filter((element) =>
          this.overlaps(
            element,
            `${application.application} ${application.contradiction}`,
          ),
        );

      if (matchingElements.length === 0) {
        continue;
      }

      supportItems.push({
        supportId: randomUUID(),
        category: 'triz',
        reference:
          `${application.principleNumber} — ${application.principleName}`,
        description:
          application.application,
        supportStrength: 45,
        evidenceRecordIds: [],
      });
    }

    for (
      const transfer of
      v3.crossIndustryTransfers
    ) {
      const matchingElements =
        elements.filter((element) =>
          this.overlaps(
            element,
            `${transfer.transferredMechanism} ${transfer.implementationElements.join(' ')}`,
          ),
        );

      if (matchingElements.length === 0) {
        continue;
      }

      supportItems.push({
        supportId: randomUUID(),
        category:
          'cross-industry-transfer',
        reference: transfer.sourceIndustry,
        description:
          transfer.transferredMechanism,
        supportStrength: 40,
        evidenceRecordIds: [],
      });
    }

    const supportingEvidence =
      evidence.filter((record) =>
        record.supports.some((supported) =>
          elements.some((element) =>
            this.overlaps(
              supported,
              element,
            ),
          ),
        ),
      );

    for (const record of supportingEvidence) {
      supportItems.push({
        supportId: randomUUID(),
        category: 'external-evidence',
        reference:
          record.publicationNumber ||
          record.reference ||
          record.title,
        description: record.title,
        supportStrength: this.clamp(
          record.relevance * 0.5 +
            record.reliability * 0.5,
        ),
        evidenceRecordIds: [record.id],
      });
    }

    const unsupportedElements =
      elements.filter(
        (element) =>
          !supportItems.some((item) =>
            this.overlaps(
              item.description,
              element,
            ),
          ),
      );

    const contradictions =
      evidence
        .filter((record) =>
          record.contradicts.some(
            (contradiction) =>
              elements.some((element) =>
                this.overlaps(
                  contradiction,
                  element,
                ),
              ),
          ),
        )
        .map(
          (record) =>
            `${record.title}: ${record.contradicts.join('، ')}`,
        );

    const supportCoverage =
      elements.length === 0
        ? 0
        : ((elements.length -
              unsupportedElements.length) /
            elements.length) *
          100;

    const evidenceSupportedElements =
      elements.filter((element) =>
        supportingEvidence.some(
          (record) =>
            record.supports.some(
              (supported) =>
                this.overlaps(
                  supported,
                  element,
                ),
            ),
        ),
      ).length;

    const evidenceCoverage =
      elements.length === 0
        ? 0
        : (evidenceSupportedElements /
            elements.length) *
          100;

    return {
      claimNumber: claim.claimNumber,
      claimType: claim.type,
      claimText: claim.text,

      elements,
      supportItems,

      supportCoverage:
        this.round(supportCoverage),
      evidenceCoverage:
        this.round(evidenceCoverage),

      unsupportedElements,
      contradictions,

      status: this.status(
        supportCoverage,
        unsupportedElements.length,
        contradictions.length,
      ),
    };
  }

  private extractClaimElements(
    claim: DraftPatentClaim,
  ): string[] {
    const supportElements =
      claim.supportElements
        .map((value) => value.trim())
        .filter(Boolean);

    const clauses = claim.text
      .split(/[؛،.]/)
      .map((value) => value.trim())
      .filter(
        (value) => value.length >= 12,
      );

    return [
      ...new Set([
        ...supportElements,
        ...clauses,
      ]),
    ].slice(0, 20);
  }

  private mechanismSupports(
    mechanism: InventiveMechanism,
    element: string,
  ): boolean {
    return this.overlaps(
      [
        mechanism.name,
        mechanism.technicalProblem,
        mechanism.mechanism,
        ...mechanism.inputs,
        ...mechanism.processingSteps,
        ...mechanism.outputs,
        mechanism.technicalEffect,
      ].join(' '),
      element,
    );
  }

  private overlaps(
    left: string,
    right: string,
  ): boolean {
    const leftTokens =
      this.tokens(left);
    const rightTokens =
      this.tokens(right);

    if (
      leftTokens.size === 0 ||
      rightTokens.size === 0
    ) {
      return false;
    }

    let matches = 0;

    for (const token of leftTokens) {
      if (rightTokens.has(token)) {
        matches += 1;
      }
    }

    const smallest = Math.min(
      leftTokens.size,
      rightTokens.size,
    );

    return (
      matches >= 2 ||
      matches / smallest >= 0.35
    );
  }

  private tokens(
    value: string,
  ): Set<string> {
    return new Set(
      value
        .toLowerCase()
        .replace(
          /[^\p{L}\p{N}\s]/gu,
          ' ',
        )
        .split(/\s+/)
        .map((item) => item.trim())
        .filter(
          (item) => item.length >= 3,
        ),
    );
  }

  private status(
    supportCoverage: number,
    unsupportedCount: number,
    contradictionCount: number,
  ): ClaimSupportMatrixRow['status'] {
    if (contradictionCount > 0) {
      return 'contradicted';
    }

    if (
      supportCoverage >= 85 &&
      unsupportedCount === 0
    ) {
      return 'supported';
    }

    if (supportCoverage >= 45) {
      return 'partially-supported';
    }

    return 'unsupported';
  }

  private clamp(
    value: number,
  ): number {
    return Math.max(
      0,
      Math.min(100, value),
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(value * 100) / 100;
  }
}
