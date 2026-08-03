import type {
  CapabilityIdentifier,
} from '../../contracts';
import type {
  CapabilityRegistryRecord,
} from '../models/capability-registry-record';

export interface CapabilityRegistryRepository {
  save(
    record: CapabilityRegistryRecord,
  ): Promise<CapabilityRegistryRecord>;

  findById(
    capabilityId: CapabilityIdentifier,
  ): Promise<CapabilityRegistryRecord | undefined>;

  exists(
    capabilityId: CapabilityIdentifier,
  ): Promise<boolean>;

  findAll(): Promise<readonly CapabilityRegistryRecord[]>;

  delete(
    capabilityId: CapabilityIdentifier,
  ): Promise<void>;

  clear(): Promise<void>;
}