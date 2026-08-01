import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataAsset } from '../intelligence-core.types';

@Injectable()
export class DataFabricService {
  private readonly assets = new Map<
    string,
    DataAsset
  >();

  register(input: {
    key: string;
    name: string;
    domain: string;
    schemaVersion: string;
    classification:
      | 'public'
      | 'internal'
      | 'confidential'
      | 'restricted';
  }): DataAsset {
    const existing = this.assets.get(input.key);

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const asset: DataAsset = {
      id: randomUUID(),
      ...input,
      records: [],
      createdAt: now,
      updatedAt: now,
    };

    this.assets.set(asset.key, asset);
    return asset;
  }

  append(
    key: string,
    record: Record<string, unknown>,
  ) {
    const asset = this.get(key);
    asset.records.push(record);
    asset.updatedAt =
      new Date().toISOString();

    return {
      assetKey: key,
      records: asset.records.length,
    };
  }

  query(
    key: string,
    predicate?: (
      record: Record<string, unknown>,
    ) => boolean,
  ) {
    const records = this.get(key).records;

    return predicate
      ? records.filter(predicate)
      : [...records];
  }

  get(key: string) {
    const asset = this.assets.get(key);

    if (!asset) {
      throw new Error(
        `Data asset not found: ${key}`,
      );
    }

    return asset;
  }

  list() {
    return [...this.assets.values()];
  }

  summary() {
    const assets = this.list();

    return {
      assets: assets.length,
      records: assets.reduce(
        (sum, item) =>
          sum + item.records.length,
        0,
      ),
      domains: [
        ...new Set(
          assets.map((item) => item.domain),
        ),
      ],
    };
  }
}