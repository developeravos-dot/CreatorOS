import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { CreateCanonicalFingerprintsDto } from './dto/create-canonical-fingerprints.dto';
import { ValidateVisualConsistencyDto } from './dto/validate-visual-consistency.dto';

import { VisualConsistencyService } from './visual-consistency.service';

@Controller(
  'enterprise/infinite-universe/visual-consistency',
)
export class VisualConsistencyController {
  constructor(
    private readonly service:
      VisualConsistencyService,
  ) {}

  @Get('status')
  getStatus() {
    return this.service
      .getStatus();
  }

  @Post('fingerprints')
  createFingerprints(
    @Body()
    dto: CreateCanonicalFingerprintsDto,
  ) {
    return this.service
      .createFingerprints(dto);
  }

  @Post('validate')
  validate(
    @Body()
    dto: ValidateVisualConsistencyDto,
  ) {
    return this.service
      .validate(dto);
  }

  @Get('world/:worldId/fingerprints')
  async getFingerprints(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      fingerprints:
        await this.service
          .getFingerprints(
            worldId,
          ),
    };
  }

  @Get('world/:worldId/validations')
  async getValidations(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      validations:
        await this.service
          .getValidations(
            worldId,
          ),
    };
  }
}
