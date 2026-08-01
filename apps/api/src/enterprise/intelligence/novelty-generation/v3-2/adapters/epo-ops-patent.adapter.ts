import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import type { PatentSearchAdapter } from './patent-search-adapter';
import type {
  NormalizedPatentDocument,
  PatentSearchProviderStatus,
  PatentSearchRequest,
} from '../models/novelty-v3-2.models';

interface EpoTokenResponse {
  access_token?: string;
  expires_in?: number | string;
}

interface SearchPublication {
  country: string;
  docNumber: string;
  kind?: string;
  title?: string;
}

@Injectable()
export class EpoOpsPatentAdapter
  implements PatentSearchAdapter
{
  private readonly baseUrl =
    process.env.EPO_OPS_BASE_URL?.trim() ||
    'https://ops.epo.org/3.2';

  private readonly consumerKey =
    process.env.EPO_OPS_CONSUMER_KEY?.trim() || '';

  private readonly consumerSecret =
    process.env.EPO_OPS_CONSUMER_SECRET?.trim() || '';

  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    removeNSPrefix: true,
    trimValues: true,
    parseTagValue: false,
  });

  private cachedToken?: {
    value: string;
    expiresAt: number;
  };

  getStatus(): PatentSearchProviderStatus {
    const configured =
      this.consumerKey.length > 0 &&
      this.consumerSecret.length > 0;

    return {
      id: 'espacenet',
      name: 'EPO Open Patent Services',
      enabled: configured,
      available: configured,
      mode: 'licensed-api',
      requiresCredentials: true,
      capabilities: [
        'official EPO patent search',
        'bibliographic retrieval',
        'abstract retrieval',
        'claims retrieval',
        'publication metadata',
      ],
      limitation: configured
        ? 'EPO OPS متصل ويخضع لشروط الاستخدام وحدود الاستهلاك.'
        : 'أضف EPO_OPS_CONSUMER_KEY وEPO_OPS_CONSUMER_SECRET.',
    };
  }

  async search(
    request: PatentSearchRequest,
  ): Promise<NormalizedPatentDocument[]> {
    this.assertConfigured();

    const token = await this.getAccessToken();

    const maximumDocuments = Math.max(
      1,
      Math.min(request.maximumDocuments, 25),
    );

    const query = this.createCqlQuery(
      request.queryPlan.query,
    );

    const searchUrl =
      `${this.baseUrl}/rest-services/published-data/search` +
      `?q=${encodeURIComponent(query)}`;

    const searchXml = await this.fetchXml(
      searchUrl,
      token,
      {
        Range: `1-${maximumDocuments}`,
      },
    );

    const publications =
      this.extractSearchPublications(searchXml)
        .slice(0, maximumDocuments);

    const output: NormalizedPatentDocument[] = [];

    for (const publication of publications) {
      output.push(
        await this.fetchPublication(
          publication,
          request,
          token,
        ),
      );
    }

    return output;
  }

  private async getAccessToken(): Promise<string> {
    if (
      this.cachedToken &&
      this.cachedToken.expiresAt >
        Date.now() + 30_000
    ) {
      return this.cachedToken.value;
    }

    const basic = Buffer.from(
      `${this.consumerKey}:${this.consumerSecret}`,
      'utf8',
    ).toString('base64');

    const response = await fetch(
      `${this.baseUrl}/auth/accesstoken`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basic}`,
          'Content-Type':
            'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: 'grant_type=client_credentials',
      },
    );

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `EPO OPS authentication failed ` +
        `(${response.status}): ${body.slice(0, 500)}`,
      );
    }

    const parsed =
      JSON.parse(body) as EpoTokenResponse;

    if (!parsed.access_token) {
      throw new Error(
        'EPO OPS returned no access token.',
      );
    }

    const expiresIn =
      Number(parsed.expires_in ?? 1200);

    this.cachedToken = {
      value: parsed.access_token,
      expiresAt:
        Date.now() +
        Math.max(60, expiresIn) * 1000,
    };

    return parsed.access_token;
  }

  private async fetchPublication(
    publication: SearchPublication,
    request: PatentSearchRequest,
    token: string,
  ): Promise<NormalizedPatentDocument> {
    const epodoc =
      `${publication.country}${publication.docNumber}`;

    const root =
      `${this.baseUrl}/rest-services/published-data/publication/epodoc/` +
      `${encodeURIComponent(epodoc)}`;

    const [
      bibliographicXml,
      abstractXml,
      claimsXml,
    ] = await Promise.all([
      this.safeFetchXml(
        `${root}/biblio`,
        token,
      ),
      this.safeFetchXml(
        `${root}/abstract`,
        token,
      ),
      this.safeFetchXml(
        `${root}/claims`,
        token,
      ),
    ]);

    const title =
      this.firstTextByKey(
        bibliographicXml,
        'invention-title',
      ) ||
      publication.title ||
      epodoc;

    const abstract =
      this.collectTextByKey(
        abstractXml,
        'abstract',
      ).join(' ');

    const claims =
      this.collectTextByKey(
        claimsXml,
        'claim-text',
      );

    const publicationNumber =
      `${publication.country}` +
      `${publication.docNumber}` +
      `${publication.kind ?? ''}`;

    return {
      documentId: randomUUID(),
      providerId: 'espacenet',

      title,
      abstract,
      claims,

      publicationNumber,

      applicants:
        this.collectTextByKey(
          bibliographicXml,
          'applicant-name',
        ),

      inventors:
        this.collectTextByKey(
          bibliographicXml,
          'inventor-name',
        ),

      classifications:
        this.collectTextByKey(
          bibliographicXml,
          'classification-symbol',
        ),

      sourceReference:
        `epo-ops:${publicationNumber}`,

      sourceUrl:
        `https://worldwide.espacenet.com/patent/search?q=pn%3D${publicationNumber}`,

      queryId:
        request.queryPlan.queryId,

      retrievedAt:
        new Date().toISOString(),

      verificationStatus: 'verified',
      synthetic: false,
    };
  }

  private extractSearchPublications(
    xml: string,
  ): SearchPublication[] {
    if (!xml.trim()) {
      return [];
    }

    const parsed =
      this.parser.parse(xml) as unknown;

    const nodes =
      this.findObjectsByKey(
        parsed,
        'document-id',
      );

    const output: SearchPublication[] = [];

    for (const node of nodes) {
      const country =
        this.valueOf(node['country']);

      const docNumber =
        this.valueOf(node['doc-number']);

      const kind =
        this.valueOf(node['kind']);

      if (!country || !docNumber) {
        continue;
      }

      const key =
        `${country}:${docNumber}:${kind}`;

      if (
        output.some(
          (item) =>
            `${item.country}:${item.docNumber}:${item.kind}` === key,
        )
      ) {
        continue;
      }

      output.push({
        country,
        docNumber,
        kind: kind || undefined,
      });
    }

    return output;
  }

  private createCqlQuery(
    rawQuery: string,
  ): string {
    const cleaned = rawQuery
      .replace(/["']/g, ' ')
      .replace(/\bOR\b/gi, ' ')
      .replace(/\bAND\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const words = cleaned
      .split(' ')
      .filter(
        (word) => word.length >= 3,
      )
      .slice(0, 8);

    if (words.length === 0) {
      return 'ta=procurement';
    }

    return words
      .map(
        (word) =>
          `ta="${word.replace(/"/g, '')}"`,
      )
      .join(' or ');
  }

  private async safeFetchXml(
    url: string,
    token: string,
  ): Promise<string> {
    try {
      return await this.fetchXml(
        url,
        token,
      );
    } catch {
      return '';
    }
  }

  private async fetchXml(
    url: string,
    token: string,
    extraHeaders: Record<string, string> = {},
  ): Promise<string> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:
          'application/exchange+xml',
        ...extraHeaders,
      },
    });

    const body = await response.text();

    if (!response.ok) {
      throw new Error(
        `EPO OPS request failed ` +
        `(${response.status}): ${body.slice(0, 500)}`,
      );
    }

    return body;
  }

  private collectTextByKey(
    xml: string,
    key: string,
  ): string[] {
    if (!xml.trim()) {
      return [];
    }

    const parsed =
      this.parser.parse(xml) as unknown;

    const values =
      this.findValuesByKey(parsed, key)
        .flatMap(
          (value) =>
            this.flattenText(value),
        )
        .map(
          (value) =>
            value
              .replace(/\s+/g, ' ')
              .trim(),
        )
        .filter(Boolean);

    return [...new Set(values)];
  }

  private firstTextByKey(
    xml: string,
    key: string,
  ): string {
    return (
      this.collectTextByKey(
        xml,
        key,
      )[0] ?? ''
    );
  }

  private findValuesByKey(
    value: unknown,
    key: string,
  ): unknown[] {
    const output: unknown[] = [];

    if (Array.isArray(value)) {
      for (const item of value) {
        output.push(
          ...this.findValuesByKey(
            item,
            key,
          ),
        );
      }

      return output;
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      const record =
        value as Record<string, unknown>;

      for (
        const [currentKey, currentValue]
        of Object.entries(record)
      ) {
        if (currentKey === key) {
          output.push(currentValue);
        }

        output.push(
          ...this.findValuesByKey(
            currentValue,
            key,
          ),
        );
      }
    }

    return output;
  }

  private findObjectsByKey(
    value: unknown,
    key: string,
  ): Array<Record<string, unknown>> {
    return this.findValuesByKey(
      value,
      key,
    ).filter(
      (
        item,
      ): item is Record<string, unknown> =>
        Boolean(item) &&
        typeof item === 'object' &&
        !Array.isArray(item),
    );
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
      return value.flatMap(
        (item) =>
          this.flattenText(item),
      );
    }

    if (
      value &&
      typeof value === 'object'
    ) {
      const record =
        value as Record<string, unknown>;

      return Object.entries(record)
        .filter(
          ([key]) =>
            !key.startsWith('@_'),
        )
        .flatMap(
          ([, item]) =>
            this.flattenText(item),
        );
    }

    return [];
  }

  private valueOf(
    value: unknown,
  ): string {
    return (
      this.flattenText(value)[0] ?? ''
    ).trim();
  }

  private assertConfigured(): void {
    if (
      !this.consumerKey ||
      !this.consumerSecret
    ) {
      throw new Error(
        'EPO OPS credentials are not configured.',
      );
    }
  }
}
