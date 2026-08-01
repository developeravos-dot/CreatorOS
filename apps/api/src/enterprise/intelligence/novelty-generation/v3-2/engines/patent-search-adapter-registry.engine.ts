import { Injectable } from '@nestjs/common';

import { EpoOpsPatentAdapter } from '../adapters/epo-ops-patent.adapter';
import { LensPatentAdapter } from '../adapters/lens-patent.adapter';
import { LocalSimulationPatentAdapter } from '../adapters/local-simulation-patent.adapter';

import type { PatentSearchAdapter } from '../adapters/patent-search-adapter';

import type {
  PatentSearchProviderId,
  PatentSearchProviderStatus,
} from '../models/novelty-v3-2.models';

@Injectable()
export class PatentSearchAdapterRegistry {
  constructor(
    private readonly localSimulationAdapter:
      LocalSimulationPatentAdapter,

    private readonly epoOpsPatentAdapter:
      EpoOpsPatentAdapter,

    private readonly lensPatentAdapter:
      LensPatentAdapter,
  ) {}

  getAdapter(
    providerId: PatentSearchProviderId,
  ): PatentSearchAdapter | undefined {
    if (
      providerId === 'local-simulation'
    ) {
      return this.localSimulationAdapter;
    }

    if (providerId === 'espacenet') {
      return this.availableAdapter(
        this.epoOpsPatentAdapter,
      );
    }

    if (
      providerId === 'lens-patents'
    ) {
      return this.availableAdapter(
        this.lensPatentAdapter,
      );
    }

    return undefined;
  }

  getStatuses():
    PatentSearchProviderStatus[] {
    return [
      this.localSimulationAdapter.getStatus(),
      this.epoOpsPatentAdapter.getStatus(),
      this.lensPatentAdapter.getStatus(),

      {
        id: 'google-patents',
        name: 'Google Patents Adapter',
        enabled: false,
        available: false,
        mode: 'browser-adapter',
        requiresCredentials: false,

        capabilities: [
          'patent document search',
          'claims retrieval',
          'family lookup',
        ],

        limitation:
          'لا توجد واجهة Google Patents رسمية مستقرة مفعلة داخل النظام.',
      },

      {
        id: 'wipo-patentscope',
        name: 'WIPO Patentscope Adapter',
        enabled: false,
        available: false,
        mode: 'browser-adapter',
        requiresCredentials: false,

        capabilities: [
          'PCT search',
          'international applications',
        ],

        limitation:
          'واجهة التنفيذ الخارجية غير مهيأة بعد.',
      },

      {
        id: 'uspto',
        name: 'USPTO Open Data Adapter',
        enabled: false,
        available: false,
        mode: 'public-api',
        requiresCredentials: false,

        capabilities: [
          'US patent metadata',
          'office action citations',
          'application records',
        ],

        limitation:
          'واجهات USPTO القديمة انتقلت إلى Open Data Portal الجديد، وسيتم ربط المزود بعد تثبيت عقد API النهائي.',
      },
    ];
  }

  availableProviders():
    PatentSearchProviderId[] {
    return this.getStatuses()
      .filter(
        (status) =>
          status.enabled &&
          status.available,
      )
      .map(
        (status) => status.id,
      );
  }

  private availableAdapter(
    adapter: PatentSearchAdapter,
  ): PatentSearchAdapter | undefined {
    const status =
      adapter.getStatus();

    return (
      status.enabled &&
      status.available
    )
      ? adapter
      : undefined;
  }
}
