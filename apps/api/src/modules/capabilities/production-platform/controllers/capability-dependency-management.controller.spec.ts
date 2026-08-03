import {
  CapabilityDependencyManagementController,
} from './capability-dependency-management.controller';

describe(
  'CapabilityDependencyManagementController',
  () => {
    function setup() {
      const dependencies = {
        resolve:
          jest.fn(() => ({
            status:
              'resolved',
          })),

        createPlan:
          jest.fn(() => ({
            executable:
              true,
          })),

        summarize:
          jest.fn(() => ({
            status:
              'resolved',
            executable:
              true,
          })),

        bulkAnalyze:
          jest.fn(() => ({
            requested: 1,
            succeeded: 1,
            failed: 0,
          })),
      };

      const controller =
        new CapabilityDependencyManagementController(
          dependencies as never,
        );

      return {
        controller,
        dependencies,
      };
    }

    const resolutionInput = {
      rootCapabilityId:
        'creatoros.capability.root',
      catalog: [],
    };

    it(
      'delegates dependency resolution',
      () => {
        const {
          controller,
          dependencies,
        } = setup();

        expect(
          controller.resolve(
            resolutionInput,
          ),
        ).toEqual({
          status:
            'resolved',
        });

        expect(
          dependencies.resolve,
        ).toHaveBeenCalledWith(
          resolutionInput,
        );
      },
    );

    it(
      'delegates dependency plan creation',
      () => {
        const {
          controller,
          dependencies,
        } = setup();

        expect(
          controller.createPlan(
            resolutionInput,
          ),
        ).toEqual({
          executable:
            true,
        });

        expect(
          dependencies.createPlan,
        ).toHaveBeenCalledWith(
          resolutionInput,
        );
      },
    );

    it(
      'delegates dependency summary creation',
      () => {
        const {
          controller,
          dependencies,
        } = setup();

        expect(
          controller.summarize(
            resolutionInput,
          ),
        ).toEqual({
          status:
            'resolved',
          executable:
            true,
        });

        expect(
          dependencies.summarize,
        ).toHaveBeenCalledWith(
          resolutionInput,
        );
      },
    );

    it(
      'delegates bulk dependency analysis',
      () => {
        const {
          controller,
          dependencies,
        } = setup();

        const input = {
          requests: [
            {
              rootCapabilityId:
                'creatoros.capability.root',
            },
          ],
          catalog: [],
        };

        expect(
          controller.bulkAnalyze(
            input,
          ),
        ).toEqual({
          requested: 1,
          succeeded: 1,
          failed: 0,
        });

        expect(
          dependencies.bulkAnalyze,
        ).toHaveBeenCalledWith(
          input,
        );
      },
    );
  },
);