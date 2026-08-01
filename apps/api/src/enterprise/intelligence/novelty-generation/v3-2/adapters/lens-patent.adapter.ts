import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import type { PatentSearchAdapter } from './patent-search-adapter';

import type {
  NormalizedPatentDocument,
  PatentSearchProviderStatus,
  PatentSearchRequest,
} from '../models/novelty-v3-2.models';

interface LensPatentResponse {
  total?: number;
  results?: number;
  data?: LensPatentRecord[];
}

interface LensPatentRecord {
  lens_id?: string;
  jurisdiction?: string;
  doc_number?: string;
  kind?: string;
  doc_key?: string;
  date_published?: string;
  publication_type?: string;
  lang?: string;

  title?: unknown;
  abstract?: unknown;
  claim?: unknown;
  claims?: unknown;
  description?: unknown;

  biblio?: {
    publication_reference?: unknown;
    application_reference?: unknown;
    priority_claims?: unknown;

    parties?: {
      applicants?: unknown;
      inventors?: unknown;
      owners_all?: unknown;
    };

    classifications_cpc?: unknown;
    classifications_ipcr?: unknown;
    classifications_ipc?: unknown;
  };
}

@Injectable()
export class LensPatentAdapter
  implements PatentSearchAdapter
{
  private readonly baseUrl =
    process.env.LENS_PATENT_API_BASE_URL?.trim() ||
    'https://api.lens.org';

  private readonly accessToken =
    process.env.LENS_PATENT_API_TOKEN?.trim() || '';

  getStatus(): PatentSearchProviderStatus {
    const configured =
      this.accessToken.length > 0;

    return {
      id: 'lens-patents',
      name: 'Lens Patent API',
      enabled: configured,
      available: configured,
      mode: 'licensed-api',
      requiresCredentials: true,

      capabilities: [
        'global patent corpus search',
        'title and abstract retrieval',
        'claims retrieval',
        'bibliographic metadata',
        'classification retrieval',
        'family-ready normalized records',
      ],

      limitation: configured
        ? 'Lens Patent API متصل ويخضع لخطة الاستخدام وحدود الطلبات وشروط الإسناد.'
        : 'أضف LENS_PATENT_API_TOKEN لتفعيل المزود.',
    };
  }

  async search(
    request: PatentSearchRequest,
  ): Promise<NormalizedPatentDocument[]> {
    this.assertConfigured();

    const maximumDocuments = Math.max(
      1,
      Math.min(
        request.maximumDocuments,
        100,
      ),
    );

    const payload = {
      query: this.cleanQuery(
        request.queryPlan.query,
      ),

      size: maximumDocuments,
      from: 0,

      language:
        this.normalizeLanguage(
          request.language,
        ),

      include: [
        'lens_id',
        'jurisdiction',
        'doc_number',
        'kind',
        'doc_key',
        'date_published',
        'publication_type',
        'lang',
        'title',
        'abstract',
        'claim',
        'claims',
        'description',
        'biblio',
      ],
    };

    const response = await fetch(
      `${this.baseUrl}/patent/search`,
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${this.accessToken}`,

          'Content-Type':
            'application/json',

          Accept:
            'application/json',
        },

        body: JSON.stringify(payload),
      },
    );

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `Lens Patent API request failed ` +
        `(${response.status}): ` +
        `${body.slice(0, 1000)}`,
      );
    }

    if (!body.trim()) {
      return [];
    }

    let parsed: LensPatentResponse;

    try {
      parsed =
        JSON.parse(body) as LensPatentResponse;
    } catch {
      throw new Error(
        'Lens Patent API returned invalid JSON.',
      );
    }

    const records =
      Array.isArray(parsed.data)
        ? parsed.data
        : [];

    return records
      .slice(0, maximumDocuments)
      .map((record) =>
        this.normalizeRecord(
          record,
          request,
        ),
      );
  }

  private normalizeRecord(
    record: LensPatentRecord,
    request: PatentSearchRequest,
  ): NormalizedPatentDocument {
    const publicationNumber =
      this.publicationNumber(record);

    const title =
      this.firstText(record.title) ||
      publicationNumber ||
      record.lens_id ||
      'Untitled patent document';

    const abstract =
      this.joinText(record.abstract);

    const claims = this.unique([
      ...this.textArray(record.claim),
      ...this.textArray(record.claims),
    ]);

    const applicants =
      this.partyNames(
        record.biblio?.parties?.applicants,
      );

    const inventors =
      this.partyNames(
        record.biblio?.parties?.inventors,
      );

    const classifications =
      this.unique([
        ...this.textArray(
          record.biblio
            ?.classifications_cpc,
        ),

        ...this.textArray(
          record.biblio
            ?.classifications_ipcr,
        ),

        ...this.textArray(
          record.biblio
            ?.classifications_ipc,
        ),
      ]);

    const sourceId =
      record.lens_id ||
      record.doc_key ||
      publicationNumber ||
      randomUUID();

    return {
      documentId: randomUUID(),
      providerId: 'lens-patents',

      title,
      abstract,
      claims,

      publicationNumber:
        publicationNumber || undefined,

      applicationNumber:
        this.applicationNumber(record),

      publicationDate:
        record.date_published,

      applicants,
      inventors,
      classifications,

      sourceReference:
        `lens:${sourceId}`,

      sourceUrl:
        record.lens_id
          ? `https://www.lens.org/lens/patent/${encodeURIComponent(record.lens_id)}`
          : undefined,

      queryId:
        request.queryPlan.queryId,

      retrievedAt:
        new Date().toISOString(),

      verificationStatus: 'verified',
      synthetic: false,
    };
  }

  private publicationNumber(
    record: LensPatentRecord,
  ): string {
    if (
      record.jurisdiction &&
      record.doc_number
    ) {
      return (
        `${record.jurisdiction}` +
        `${record.doc_number}` +
        `${record.kind ?? ''}`
      );
    }

    if (record.doc_key) {
      return record.doc_key;
    }

    return '';
  }

  private applicationNumber(
    record: LensPatentRecord,
  ): string | undefined {
    const values =
      this.textArray(
        record.biblio
          ?.application_reference,
      );

    return values[0];
  }

  private partyNames(
    value: unknown,
  ): string[] {
    return this.unique(
      this.extractNamedValues(value),
    );
  }

  private extractNamedValues(
    value: unknown,
  ): string[] {
    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return [String(value)];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) =>
        this.extractNamedValues(item),
      );
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      const record =
        value as Record<string, unknown>;

      const preferredKeys = [
        'name',
        'name_original',
        'extracted_name',
        'standardized_name',
        'value',
      ];

      const preferred =
        preferredKeys.flatMap((key) =>
          key in record
            ? this.extractNamedValues(
                record[key],
              )
            : [],
        );

      if (preferred.length > 0) {
        return preferred;
      }

      return Object.values(record)
        .flatMap((item) =>
          this.extractNamedValues(item),
        );
    }

    return [];
  }

  private textArray(
    value: unknown,
  ): string[] {
    return this.unique(
      this.flattenText(value),
    );
  }

  private firstText(
    value: unknown,
  ): string {
    return this.textArray(value)[0] ?? '';
  }

  private joinText(
    value: unknown,
  ): string {
    return this.textArray(value).join(' ');
  }

  private flattenText(
    value: unknown,
  ): string[] {
    if (
      typeof value === 'string' ||
      typeof value === 'number'
    ) {
      return [String(value)];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item) =>
        this.flattenText(item),
      );
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      const record =
        value as Record<string, unknown>;

      const preferredKeys = [
        'text',
        'value',
        'title',
        'claim_text',
        'abstract',
        'description',
        'name',
        'symbol',
        'classification',
      ];

      const preferred =
        preferredKeys.flatMap((key) =>
          key in record
            ? this.flattenText(
                record[key],
              )
            : [],
        );

      if (preferred.length > 0) {
        return preferred;
      }

      return Object.values(record)
        .flatMap((item) =>
          this.flattenText(item),
        );
    }

    return [];
  }

  private unique(
    values: string[],
  ): string[] {
    return [
      ...new Set(
        values
          .map((value) =>
            value
              .replace(/\s+/g, ' ')
              .trim(),
          )
          .filter(Boolean),
      ),
    ];
  }

  private cleanQuery(
    value: string,
  ): string {
    return value
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeLanguage(
    language: string,
  ): string {
    const value =
      language.trim().toUpperCase();

    if (value === 'AR') {
      return 'AR';
    }

    if (value === 'EN') {
      return 'EN';
    }

    return 'EN';
  }

  private assertConfigured(): void {
    if (!this.accessToken) {
      throw new Error(
        'Lens Patent API token is not configured.',
      );
    }
  }
}
