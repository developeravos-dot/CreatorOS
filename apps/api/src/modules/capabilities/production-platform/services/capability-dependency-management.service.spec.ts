import {
  CapabilityPlatformAuditService,
} from './capability-platform-audit.service';
import {
  CapabilityDependencyManagementService,
} from './capability-dependency-management.service';

type MockDependencyResolutionStatus =
  | 'pending'
  | 'resolved'
  | 'incompatible'
  | 'circular';

interface MockDependencyIssue {
  readonly code: string;
  readonly path?: readonly string[];
  readonly [key: string]: unknown;
}

interface MockDependencyResolutionResult {
  readonly rootCapabilityId: string;
  readonly status:
    MockDependencyResolutionStatus;
  readonly orderedCapabilityIds:
    readonly string[];
  readonly issues:
    readonly MockDependencyIssue[];
  readonly resolvedAt: string;
}

interface MockDependencyPlanResult {
  readonly rootCapabilityId: string;
  readonly executable: boolean;
  readonly orderedCapabilityIds:
    readonly string[];
  readonly steps:
    readonly unknown[];
  readonly issues:
    readonly MockDependencyIssue[];
  readonly createdAt: string;
}
describe(
  'CapabilityDependencyManagementService',
  () => {
    function setup() {
      const resolvedResult:
        MockDependencyResolutionResult = {
        rootCapabilityId:
          'creatoros.capability.root',
        status:
          'resolved',
        orderedCapabilityIds: [
          'creatoros.capability.dependency',
          'creatoros.capability.root',
        ],
        issues: [],
        resolvedAt:
          new Date().toISOString(),
      };

      const executablePlan:
        MockDependencyPlanResult = {
        rootCapabilityId:
          'creatoros.capability.root',
        executable: true,
        orderedCapabilityIds: [
          'creatoros.capability.dependency',
          'creatoros.capability.root',
        ],
        steps: [
          {
            id: 'step-1',
          },
          {
            id: 'step-2',
          },
        ],
        issues: [],
        createdAt:
          new Date().toISOString(),
      };

      const dependencyResolver = {
        resolve:
          jest.fn(() =>
            resolvedResult,
          ),

        createPlan:
          jest.fn(() =>
            executablePlan,
          ),
      };

      const audit =
        new CapabilityPlatformAuditService();

      const service =
        new CapabilityDependencyManagementService(
          {
            dependencyResolver,
          } as never,
          audit,
        );

      return {
        service,
        dependencyResolver,
        audit,
        resolvedResult,
        executablePlan,
      };
    }

    function input() {
      return {
        rootCapabilityId:
          'creatoros.capability.root',
        catalog: [
          {
            capabilityId:
              'creatoros.capability.root',
            version:
              '1.0.0',
            manifest: {
              id:
                'creatoros.capability.root',
              dependencies: [],
            },
          },
        ],
      };
    }

    it(
      'resolves capability dependencies',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        const result =
          service.resolve(
            input(),
          );

        expect(result.status).toBe(
          'resolved',
        );

        expect(
          result.orderedCapabilityIds,
        ).toEqual([
          'creatoros.capability.dependency',
          'creatoros.capability.root',
        ]);

        expect(
          dependencyResolver.resolve,
        ).toHaveBeenCalledTimes(1);

        expect(
          dependencyResolver.resolve,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            rootCapabilityId:
              'creatoros.capability.root',
            includeOptional:
              undefined,
            enforcePeerDependencies:
              undefined,
          }),
        );
      },
    );

    it(
      'creates executable dependency plans',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        const result =
          service.createPlan(
            input(),
          );

        expect(result.executable).toBe(
          true,
        );

        expect(result.steps).toHaveLength(
          2,
        );

        expect(
          dependencyResolver.createPlan,
        ).toHaveBeenCalledTimes(1);
      },
    );

    it(
      'summarizes missing and incompatible dependencies',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        dependencyResolver.resolve
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.root',
            status:
              'incompatible',
            orderedCapabilityIds: [],
            issues: [
              {
                code:
                  'DEPENDENCY_MISSING',
              },
              {
                code:
                  'DEPENDENCY_OPTIONAL_MISSING',
              },
              {
                code:
                  'DEPENDENCY_VERSION_INCOMPATIBLE',
              },
            ],
            resolvedAt:
              new Date().toISOString(),
          });

        dependencyResolver.createPlan
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.root',
            executable: false,
            orderedCapabilityIds: [],
            steps: [],
            issues: [],
            createdAt:
              new Date().toISOString(),
          });

        const result =
          service.summarize(
            input(),
          );

        expect(result.status).toBe(
          'incompatible',
        );

        expect(result.executable).toBe(
          false,
        );

        expect(
          result.missingDependencies,
        ).toBe(1);

        expect(
          result.optionalMissingDependencies,
        ).toBe(1);

        expect(
          result.incompatibleVersions,
        ).toBe(1);

        expect(
          result.circularDependencies,
        ).toBe(0);
      },
    );

    it(
      'summarizes circular dependency failures',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        dependencyResolver.resolve
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.root',
            status:
              'circular',
            orderedCapabilityIds: [],
            issues: [
              {
                code:
                  'DEPENDENCY_CIRCULAR',
                path: [
                  'creatoros.capability.root',
                  'creatoros.capability.dependency',
                  'creatoros.capability.root',
                ],
              },
            ],
            resolvedAt:
              new Date().toISOString(),
          });

        dependencyResolver.createPlan
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.root',
            executable: false,
            orderedCapabilityIds: [],
            steps: [],
            issues: [
              {
                code:
                  'DEPENDENCY_CIRCULAR',
              },
            ],
            createdAt:
              new Date().toISOString(),
          });

        const result =
          service.summarize(
            input(),
          );

        expect(result.status).toBe(
          'circular',
        );

        expect(
          result.circularDependencies,
        ).toBe(1);

        expect(result.executable).toBe(
          false,
        );
      },
    );

    it(
      'performs bulk dependency analysis',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        dependencyResolver.resolve
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.first',
            status:
              'resolved',
            orderedCapabilityIds: [
              'creatoros.capability.first',
            ],
            issues: [],
            resolvedAt:
              new Date().toISOString(),
          })
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.second',
            status:
              'incompatible',
            orderedCapabilityIds: [],
            issues: [
              {
                code:
                  'DEPENDENCY_MISSING',
              },
            ],
            resolvedAt:
              new Date().toISOString(),
          });

        dependencyResolver.createPlan
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.first',
            executable: true,
            orderedCapabilityIds: [
              'creatoros.capability.first',
            ],
            steps: [],
            issues: [],
            createdAt:
              new Date().toISOString(),
          })
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.second',
            executable: false,
            orderedCapabilityIds: [],
            steps: [],
            issues: [],
            createdAt:
              new Date().toISOString(),
          });

        const result =
          service.bulkAnalyze({
            requests: [
              {
                rootCapabilityId:
                  'creatoros.capability.first',
              },
              {
                rootCapabilityId:
                  'creatoros.capability.second',
              },
            ],
            catalog:
              input().catalog,
          });

        expect(result.requested).toBe(
          2,
        );

        expect(result.succeeded).toBe(
          2,
        );

        expect(result.failed).toBe(
          0,
        );

        expect(result.resolved).toBe(
          1,
        );

        expect(
          result.incompatible,
        ).toBe(1);

        expect(result.circular).toBe(
          0,
        );
      },
    );

    it(
      'records bulk failures and continues by default',
      () => {
        const {
          service,
          dependencyResolver,
          audit,
        } = setup();

        dependencyResolver.resolve
          .mockImplementationOnce(
            () => {
              throw new Error(
                'Planned dependency analysis failure.',
              );
            },
          )
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.second',
            status:
              'resolved',
            orderedCapabilityIds: [
              'creatoros.capability.second',
            ],
            issues: [],
            resolvedAt:
              new Date().toISOString(),
          });

        dependencyResolver.createPlan
          .mockReturnValueOnce({
            rootCapabilityId:
              'creatoros.capability.second',
            executable: true,
            orderedCapabilityIds: [
              'creatoros.capability.second',
            ],
            steps: [],
            issues: [],
            createdAt:
              new Date().toISOString(),
          });

        const result =
          service.bulkAnalyze({
            requests: [
              {
                rootCapabilityId:
                  'creatoros.capability.first',
              },
              {
                rootCapabilityId:
                  'creatoros.capability.second',
              },
            ],
            catalog:
              input().catalog,
          });

        expect(result.requested).toBe(
          2,
        );

        expect(result.succeeded).toBe(
          1,
        );

        expect(result.failed).toBe(
          1,
        );

        expect(
          result.results[0]
            ?.successful,
        ).toBe(false);

        expect(
          result.results[0]?.error,
        ).toContain(
          'Planned dependency analysis failure.',
        );

        expect(
          audit.list().some(
            (record) =>
              record.operation ===
                'operation.failed' &&
              record.message?.includes(
                'Planned dependency analysis failure.',
              ),
          ),
        ).toBe(true);
      },
    );

    it(
      'stops bulk analysis when continueOnError is false',
      () => {
        const {
          service,
          dependencyResolver,
        } = setup();

        dependencyResolver.resolve
          .mockImplementationOnce(
            () => {
              throw new Error(
                'Stop bulk analysis.',
              );
            },
          );

        const result =
          service.bulkAnalyze({
            requests: [
              {
                rootCapabilityId:
                  'creatoros.capability.first',
              },
              {
                rootCapabilityId:
                  'creatoros.capability.second',
              },
            ],
            catalog:
              input().catalog,
            continueOnError: false,
          });

        expect(
          dependencyResolver.resolve,
        ).toHaveBeenCalledTimes(1);

        expect(result.requested).toBe(
          2,
        );

        expect(result.succeeded).toBe(
          0,
        );

        expect(result.failed).toBe(
          2,
        );

        expect(result.results).toHaveLength(
          1,
        );
      },
    );

    it(
      'records resolution failures and rethrows',
      () => {
        const {
          service,
          dependencyResolver,
          audit,
        } = setup();

        dependencyResolver.resolve
          .mockImplementationOnce(
            () => {
              throw new Error(
                'Dependency resolver unavailable.',
              );
            },
          );

        expect(() =>
          service.resolve(
            input(),
          ),
        ).toThrow(
          'Dependency resolver unavailable.',
        );

        expect(
          audit.list().some(
            (record) =>
              record.operation ===
                'operation.failed' &&
              record.subjectId ===
                'creatoros.capability.root',
          ),
        ).toBe(true);
      },
    );
  },
);