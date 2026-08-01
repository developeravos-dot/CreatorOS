import { Injectable } from '@nestjs/common';
import type {
  NormalizedPatentDocument,
  PatentSearchJob,
} from '../models/novelty-v3-2.models';

@Injectable()
export class PatentDocumentNormalizerEngine {
  normalize(
    jobs: PatentSearchJob[],
  ): NormalizedPatentDocument[] {
    const documents =
      jobs.flatMap(
        (job) => job.documents,
      );

    const seen = new Set<string>();
    const output:
      NormalizedPatentDocument[] = [];

    for (const document of documents) {
      const key = this.key(document);

      if (seen.has(key)) {
        continue;
      }

      seen.add(key);

      output.push({
        ...document,
        title:
          document.title.trim(),
        abstract:
          document.abstract.trim(),
        claims:
          this.unique(document.claims),
        applicants:
          this.unique(document.applicants),
        inventors:
          this.unique(document.inventors),
        classifications:
          this.unique(
            document.classifications,
          ),
      });
    }

    return output;
  }

  private key(
    document: NormalizedPatentDocument,
  ): string {
    return (
      document.publicationNumber ||
      document.applicationNumber ||
      `${document.providerId}:${document.title}`
    )
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  private unique(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }
}
