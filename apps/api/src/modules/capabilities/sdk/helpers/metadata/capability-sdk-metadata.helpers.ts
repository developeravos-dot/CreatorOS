import type {
  CapabilityMetadata,
  CapabilityMetadataValue,
} from '../../../contracts';

type MutableCapabilityMetadata =
  Record<string, CapabilityMetadataValue>;

export const createSdkMetadata = (
  metadata: CapabilityMetadata = {},
): CapabilityMetadata =>
  Object.freeze({
    ...metadata,
  });

export const mergeSdkMetadata = (
  ...metadataValues: readonly (
    | CapabilityMetadata
    | undefined
  )[]
): CapabilityMetadata => {
  const merged: MutableCapabilityMetadata = {};

  for (const metadata of metadataValues) {
    if (!metadata) {
      continue;
    }

    for (const [key, value] of Object.entries(metadata)) {
      merged[key] = value;
    }
  }

  return Object.freeze(merged);
};

export const namespaceSdkMetadata = (
  namespace: string,
  metadata: CapabilityMetadata,
): CapabilityMetadata =>
  Object.freeze({
    [namespace]: Object.freeze({
      ...metadata,
    }),
  });

export const pickSdkMetadata = (
  metadata: CapabilityMetadata,
  keys: readonly string[],
): CapabilityMetadata => {
  const selected: MutableCapabilityMetadata = {};

  for (const key of keys) {
    if (
      Object.prototype.hasOwnProperty.call(
        metadata,
        key,
      )
    ) {
      const value = metadata[key];

      if (value !== undefined) {
        selected[key] = value;
      }
    }
  }

  return Object.freeze(selected);
};

export const omitSdkMetadata = (
  metadata: CapabilityMetadata,
  keys: readonly string[],
): CapabilityMetadata => {
  const excluded = new Set(keys);
  const selected: MutableCapabilityMetadata = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (!excluded.has(key)) {
      selected[key] = value;
    }
  }

  return Object.freeze(selected);
};

export const getSdkMetadataValue = <
  TValue extends CapabilityMetadataValue =
    CapabilityMetadataValue,
>(
  metadata: CapabilityMetadata | undefined,
  key: string,
  fallback?: TValue,
): TValue | undefined => {
  const value = metadata?.[key];

  if (value === undefined) {
    return fallback;
  }

  return value as TValue;
};

export const hasSdkMetadataValue = (
  metadata: CapabilityMetadata | undefined,
  key: string,
): boolean =>
  metadata !== undefined &&
  Object.prototype.hasOwnProperty.call(
    metadata,
    key,
  );