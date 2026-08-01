import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { ApplyCharacterEventDto } from './dto/apply-character-event.dto';
import { CreateCharacterRosterDto } from './dto/create-character-roster.dto';
import { GenerateCharacterDecisionDto } from './dto/generate-character-decision.dto';

import { CharacterOsService } from './character-os.service';

@Controller(
  'enterprise/infinite-universe/characters',
)
export class CharacterOsController {
  constructor(
    private readonly characterOsService:
      CharacterOsService,
  ) {}

  @Get('status')
  getStatus() {
    return this.characterOsService
      .getStatus();
  }

  @Post('create-roster')
  createRoster(
    @Body()
    dto: CreateCharacterRosterDto,
  ) {
    return this.characterOsService
      .createRoster(dto);
  }

  @Post('apply-event')
  applyEvent(
    @Body()
    dto: ApplyCharacterEventDto,
  ) {
    return this.characterOsService
      .applyEvent(dto);
  }

  @Post('decide')
  generateDecision(
    @Body()
    dto: GenerateCharacterDecisionDto,
  ) {
    return this.characterOsService
      .generateDecision(dto);
  }

  @Get('world/:worldId')
  async getWorldCharacters(
    @Param('worldId')
    worldId: string,
  ) {
    return {
      success: true,
      worldId,

      characters:
        await this.characterOsService
          .getWorldCharacters(
            worldId,
          ),
    };
  }

  @Get('world/:worldId/:characterId')
  async getCharacter(
    @Param('worldId')
    worldId: string,

    @Param('characterId')
    characterId: string,
  ) {
    return {
      success: true,
      worldId,
      characterId,

      character:
        await this.characterOsService
          .getCharacterById(
            worldId,
            characterId,
          ),
    };
  }
}
