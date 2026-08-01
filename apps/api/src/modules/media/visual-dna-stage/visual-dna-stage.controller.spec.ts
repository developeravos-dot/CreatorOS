import { Test, TestingModule } from '@nestjs/testing';
import { VisualDnaStageController } from './visual-dna-stage.controller';
import { VisualDnaStageService } from './visual-dna-stage.service';

describe('VisualDnaStageController', () => {
  let controller: VisualDnaStageController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({ controllers: [VisualDnaStageController], providers: [VisualDnaStageService] }).compile();
    controller = module.get(VisualDnaStageController);
  });
  it('should be defined', () => expect(controller).toBeDefined());
  it('should expose 40-stage blueprint', () => expect(controller.getBlueprint().stages).toHaveLength(40));
});
