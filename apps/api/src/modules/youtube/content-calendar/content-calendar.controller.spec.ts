import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import {
  ContentCalendarController,
} from './content-calendar.controller';

import {
  ContentCalendarService,
} from './content-calendar.service';

describe('ContentCalendarController', () => {
  let controller: ContentCalendarController;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ContentCalendarController],
        providers: [ContentCalendarService],
      }).compile();

    controller =
      module.get<ContentCalendarController>(
        ContentCalendarController,
      );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return operational dashboard', () => {
    expect(controller.getDashboard().status).toBe(
      'operational',
    );
  });

  it('should create a record', () => {
    const record = controller.createRecord({
      title: 'Controller Operation',
      category: 'controller',
    });

    expect(record.id).toBeDefined();
  });
});
