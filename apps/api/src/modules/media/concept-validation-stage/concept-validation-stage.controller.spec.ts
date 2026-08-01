import { Test } from '@nestjs/testing';
import { ConceptValidationStageController } from './concept-validation-stage.controller';
import { ConceptValidationStageService } from './concept-validation-stage.service';

describe('ConceptValidationStageController', () => {
  let controller: ConceptValidationStageController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ConceptValidationStageController],
      providers: [ConceptValidationStageService],
    }).compile();

    controller = moduleRef.get(ConceptValidationStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
