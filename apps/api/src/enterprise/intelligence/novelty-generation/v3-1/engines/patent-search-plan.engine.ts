import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NoveltyV3Result } from '../../v3/models/novelty-v3.models';
import type {
  ClaimSupportMatrixRow,
  PatentSearchQueryPlan,
} from '../models/novelty-v3-1.models';

@Injectable()
export class PatentSearchPlanEngine {
  build(
    v3: NoveltyV3Result,
    claimMatrix: ClaimSupportMatrixRow[],
    maximumQueries: number,
  ): PatentSearchQueryPlan[] {
    const output: PatentSearchQueryPlan[] =
      [];

    for (
      const mechanism of
      v3.inventiveMechanisms
    ) {
      output.push({
        queryId: randomUUID(),
        purpose: 'novelty',
        query:
          `"${mechanism.name}" OR "${mechanism.mechanism}"`,
        targetDatabases: [
          'Google Patents',
          'Espacenet',
          'WIPO Patentscope',
          'USPTO Patent Center',
        ],
        targetClaimNumbers:
          this.claimNumbersForMechanism(
            claimMatrix,
            mechanism.name,
            mechanism.mechanism,
          ),
        targetMechanisms: [
          mechanism.name,
        ],
        priority: 100,
      });

      output.push({
        queryId: randomUUID(),
        purpose:
          'technical-effect',
        query:
          `"${mechanism.technicalEffect}" AND (${mechanism.inputs.slice(0, 3).join(' OR ')})`,
        targetDatabases: [
          'Google Scholar',
          'IEEE Xplore',
          'ACM Digital Library',
          'Google Patents',
        ],
        targetClaimNumbers:
          this.claimNumbersForMechanism(
            claimMatrix,
            mechanism.name,
            mechanism.technicalEffect,
          ),
        targetMechanisms: [
          mechanism.name,
        ],
        priority: 80,
      });
    }

    for (const row of claimMatrix) {
      for (
        const unsupported of
        row.unsupportedElements.slice(0, 2)
      ) {
        output.push({
          queryId: randomUUID(),
          purpose: 'claim-element',
          query: `"${unsupported}"`,
          targetDatabases: [
            'Google Patents',
            'Espacenet',
            'WIPO Patentscope',
          ],
          targetClaimNumbers: [
            row.claimNumber,
          ],
          targetMechanisms: [],
          priority: 90,
        });
      }
    }

    for (
      const transfer of
      v3.crossIndustryTransfers
    ) {
      output.push({
        queryId: randomUUID(),
        purpose:
          'inventive-step',
        query:
          `"${transfer.sourceMechanism}" AND "${transfer.transferredMechanism}"`,
        targetDatabases: [
          'Google Patents',
          'Espacenet',
          'Google Scholar',
        ],
        targetClaimNumbers: [],
        targetMechanisms: [
          transfer.transferredMechanism,
        ],
        priority: 70,
      });
    }

    return this.uniqueQueries(output)
      .sort(
        (left, right) =>
          right.priority -
          left.priority,
      )
      .slice(
        0,
        Math.max(
          1,
          Math.min(maximumQueries, 50),
        ),
      );
  }

  private claimNumbersForMechanism(
    claimMatrix: ClaimSupportMatrixRow[],
    name: string,
    description: string,
  ): number[] {
    return claimMatrix
      .filter(
        (row) =>
          this.overlaps(
            row.claimText,
            name,
          ) ||
          this.overlaps(
            row.claimText,
            description,
          ) ||
          row.supportItems.some(
            (item) =>
              this.overlaps(
                item.reference,
                name,
              ),
          ),
      )
      .map(
        (row) => row.claimNumber,
      );
  }

  private uniqueQueries(
    queries: PatentSearchQueryPlan[],
  ): PatentSearchQueryPlan[] {
    const seen = new Set<string>();
    const output: PatentSearchQueryPlan[] =
      [];

    for (const query of queries) {
      const key =
        query.query
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .trim();

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      output.push(query);
    }

    return output;
  }

  private overlaps(
    left: string,
    right: string,
  ): boolean {
    const leftTokens =
      this.tokens(left);
    const rightTokens =
      this.tokens(right);

    let matches = 0;

    for (const token of leftTokens) {
      if (rightTokens.has(token)) {
        matches += 1;
      }
    }

    return matches >= 2;
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
}
