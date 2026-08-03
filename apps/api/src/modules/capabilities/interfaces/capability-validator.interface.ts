import type {
  CapabilityManifestContract,
  CapabilityValidationResultContract,
} from '../contracts';

export interface CapabilityValidator {
  validateManifest(
    manifest: CapabilityManifestContract,
  ): Promise<CapabilityValidationResultContract>;
}

export interface CapabilityValidationRule {
  readonly code: string;
  readonly description: string;

  validate(
    manifest: CapabilityManifestContract,
  ): CapabilityValidationResultContract | Promise<CapabilityValidationResultContract>;
}