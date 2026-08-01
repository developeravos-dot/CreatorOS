import { BadRequestException } from '@nestjs/common';
import { AvosMediaUltraEngineBase } from './avos-media-ultra-engine.base';

class TestEngine extends AvosMediaUltraEngineBase {
  constructor(
    managedStage = 'first-stage',
    stages: readonly string[] = [
      'first-stage',
      'second-stage',
    ],
  ) {
    super('Test Engine', managedStage, stages);
  }
}

describe('AvosMediaUltraEngineBase', () => {
  it('rejects an empty stage blueprint', () => {
    expect(
      () => new TestEngine('first-stage', []),
    ).toThrow('requires at least one ordered stage');
  });

  it('rejects a managed stage outside the blueprint', () => {
    expect(
      () =>
        new TestEngine('missing-stage', [
          'first-stage',
        ]),
    ).toThrow('is not registered');
  });

  it('rejects duplicate stages', () => {
    expect(
      () =>
        new TestEngine('first-stage', [
          'first-stage',
          'first-stage',
        ]),
    ).toThrow('duplicate stages');
  });

  it('creates and starts a valid project safely', () => {
    const engine = new TestEngine();
    const project = engine.createProject({
      name: 'Root Repair Project',
      owner: 'AVOS',
    });

    expect(project.currentStage).toBe('first-stage');
    expect(project.stages).toHaveLength(2);

    const started = engine.startProject(project.id);

    expect(started.status).toBe('running');
    expect(started.stages[0]?.status).toBe('running');
  });

  it('validates required project fields', () => {
    const engine = new TestEngine();

    expect(() =>
      engine.createProject({
        name: '',
        owner: 'AVOS',
      }),
    ).toThrow(BadRequestException);
  });

  it('moves safely to the next stage', () => {
    const engine = new TestEngine();
    const project = engine.createProject({
      name: 'Transition Test',
      owner: 'AVOS',
    });

    engine.startProject(project.id);
    const updated = engine.executeManagedStage(
      project.id,
      {
        score: 150,
        confidence: -10,
      },
    );

    expect(updated.currentStage).toBe('second-stage');
    expect(updated.stages[0]?.status).toBe(
      'completed',
    );
    expect(updated.stages[0]?.score).toBe(100);
    expect(updated.stages[0]?.confidence).toBe(0);
  });
});
