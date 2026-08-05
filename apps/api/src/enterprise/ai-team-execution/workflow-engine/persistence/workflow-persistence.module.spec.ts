import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../../modules/persistence';
import {
  WorkflowCheckpointEntity,
  WorkflowEventEntity,
  WorkflowExecutionEntity,
  WorkflowRecoveryEntity,
  WorkflowStepStateEntity,
} from './entities';
import { WorkflowPersistenceModule } from './workflow-persistence.module';
import {
  WorkflowCheckpointRepository,
  WorkflowEventRepository,
  WorkflowExecutionRepository,
  WorkflowRecoveryRepository,
  WorkflowStepStateRepository,
} from './repositories';

type RepositoryContract = {
  provider:
    | typeof WorkflowExecutionRepository
    | typeof WorkflowCheckpointRepository
    | typeof WorkflowStepStateRepository
    | typeof WorkflowEventRepository
    | typeof WorkflowRecoveryRepository;
  writeMethod: 'save' | 'append';
  readMethods: readonly string[];
};

const REPOSITORY_CONTRACTS: readonly RepositoryContract[] = [
  {
    provider: WorkflowExecutionRepository,
    writeMethod: 'save',
    readMethods: ['findById', 'listByStatus', 'listRecoverable'],
  },
  {
    provider: WorkflowCheckpointRepository,
    writeMethod: 'save',
    readMethods: [
      'findById',
      'findLatestByExecutionId',
      'listByExecutionId',
    ],
  },
  {
    provider: WorkflowStepStateRepository,
    writeMethod: 'save',
    readMethods: [
      'findById',
      'findByExecutionAndStep',
      'listByExecutionId',
      'listByExecutionAndStatus',
    ],
  },
  {
    provider: WorkflowEventRepository,
    writeMethod: 'append',
    readMethods: ['findById', 'listByExecutionId', 'nextSequence'],
  },
  {
    provider: WorkflowRecoveryRepository,
    writeMethod: 'save',
    readMethods: [
      'findById',
      'listByExecutionId',
      'listByStatus',
      'findLatestByExecutionId',
    ],
  },
] as const;

describe('WorkflowPersistenceModule', () => {
  let moduleRef: TestingModule;
  const prismaMock = {
    isHealthy: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [WorkflowPersistenceModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();
  });

  afterEach(async () => {
    await moduleRef.close();
    jest.clearAllMocks();
  });

  it.each([
    WorkflowExecutionEntity,
    WorkflowCheckpointEntity,
    WorkflowStepStateEntity,
    WorkflowEventEntity,
    WorkflowRecoveryEntity,
  ])('registers entity provider %p', (provider) => {
    expect(moduleRef.get(provider)).toBeInstanceOf(provider);
  });

  it.each(REPOSITORY_CONTRACTS)(
    'registers $provider.name with its semantic persistence contract',
    ({ provider, writeMethod, readMethods }) => {
      const repository = moduleRef.get(provider) as unknown as Record<
        string,
        unknown
      >;

      expect(repository).toBeInstanceOf(provider);
      expect(repository[writeMethod]).toEqual(expect.any(Function));

      for (const readMethod of readMethods) {
        expect(repository[readMethod]).toEqual(expect.any(Function));
      }
    },
  );

  it('keeps event persistence append-only', () => {
    const repository = moduleRef.get(WorkflowEventRepository);

    expect(repository.append).toEqual(expect.any(Function));
    expect(
      (repository as unknown as { save?: unknown }).save,
    ).toBeUndefined();
  });

  it('injects the shared Prisma service into every repository', () => {
    for (const { provider } of REPOSITORY_CONTRACTS) {
      const repository = moduleRef.get(provider) as unknown as {
        prisma: PrismaService;
      };

      expect(repository.prisma).toBe(prismaMock);
    }
  });

  it('exports the shared Prisma service through the workflow layer', () => {
    expect(moduleRef.get(PrismaService)).toBe(prismaMock);
  });
});
