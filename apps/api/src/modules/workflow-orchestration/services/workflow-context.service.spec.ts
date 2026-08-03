import {
  WorkflowContextService,
} from './workflow-context.service';

describe(
  'WorkflowContextService',
  () => {
    let service:
      WorkflowContextService;

    beforeEach(() => {
      service =
        new WorkflowContextService();
    });

    it(
      'creates context snapshots with variables and correlation',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'projectId',
                type:
                  'string',
                value:
                  'project-one',
                mutable: false,
                secret: false,
              },
            ],
            input: {
              requestId:
                'request-one',
            },
            metadata: {
              source:
                'unit-test',
            },
            correlation: {
              correlationId:
                'correlation-one',
              traceId:
                'trace-one',
            },
          });

        expect(
          context.variables
            .projectId
            ?.value,
        ).toBe(
          'project-one',
        );

        expect(
          context.input
            .requestId,
        ).toBe(
          'request-one',
        );

        expect(
          context.correlation
            .traceId,
        ).toBe(
          'trace-one',
        );
      },
    );

    it(
      'rejects duplicate variables during context creation',
      () => {
        expect(() =>
          service.create({
            variables: [
              {
                name:
                  'counter',
                type:
                  'number',
                value: 1,
                mutable: true,
                secret: false,
              },
              {
                name:
                  'counter',
                type:
                  'number',
                value: 2,
                mutable: true,
                secret: false,
              },
            ],
          }),
        ).toThrow(
          'already exists',
        );
      },
    );

    it(
      'gets and requires variables',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'counter',
                type:
                  'number',
                value: 1,
                mutable: true,
                secret: false,
              },
            ],
          });

        expect(
          service.getVariable(
            context,
            'counter',
          )?.value,
        ).toBe(1);

        expect(
          service.requireVariable(
            context,
            'counter',
          ).name,
        ).toBe(
          'counter',
        );

        expect(() =>
          service.requireVariable(
            context,
            'missing',
          ),
        ).toThrow(
          'was not found',
        );
      },
    );

    it(
      'updates mutable variables',
      () => {
        let context =
          service.create({
            variables: [
              {
                name:
                  'counter',
                type:
                  'number',
                value: 1,
                mutable: true,
                secret: false,
              },
            ],
          });

        context =
          service.setVariable(
            context,
            {
              name:
                'counter',
              type:
                'number',
              value: 2,
              mutable: true,
              secret: false,
            },
          );

        expect(
          context.variables
            .counter
            ?.value,
        ).toBe(2);
      },
    );

    it(
      'sets multiple workflow variables',
      () => {
        const context =
          service.setVariables(
            service.create(),
            [
              {
                name:
                  'first',
                type:
                  'string',
                value:
                  'one',
                mutable: true,
                secret: false,
              },
              {
                name:
                  'second',
                type:
                  'number',
                value: 2,
                mutable: true,
                secret: false,
              },
            ],
          );

        expect(
          service.listVariables(
            context,
          ).map(
            (variable) =>
              variable.name,
          ),
        ).toEqual([
          'first',
          'second',
        ]);
      },
    );

    it(
      'protects immutable variables from update and deletion',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'immutable',
                type:
                  'string',
                value:
                  'one',
                mutable: false,
                secret: false,
              },
            ],
          });

        expect(() =>
          service.setVariable(
            context,
            {
              name:
                'immutable',
              type:
                'string',
              value:
                'two',
              mutable: false,
              secret: false,
            },
          ),
        ).toThrow(
          'immutable',
        );

        expect(() =>
          service.deleteVariable(
            context,
            'immutable',
          ),
        ).toThrow(
          'immutable',
        );
      },
    );

    it(
      'deletes mutable variables',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'temporary',
                type:
                  'string',
                value:
                  'value',
                mutable: true,
                secret: false,
              },
            ],
          });

        const updated =
          service.deleteVariable(
            context,
            'temporary',
          );

        expect(
          service.hasVariable(
            updated,
            'temporary',
          ),
        ).toBe(false);
      },
    );

    it(
      'merges input output metadata and correlation',
      () => {
        let context =
          service.create({
            correlation: {
              correlationId:
                'correlation-one',
            },
          });

        context =
          service.mergeInput(
            context,
            {
              inputValue: 1,
            },
          );

        context =
          service.mergeOutput(
            context,
            {
              outputValue: 2,
            },
          );

        context =
          service.mergeMetadata(
            context,
            {
              source:
                'test',
            },
          );

        context =
          service.updateCorrelation(
            context,
            {
              traceId:
                'trace-one',
            },
          );

        expect(
          context.input
            .inputValue,
        ).toBe(1);

        expect(
          context.output
            .outputValue,
        ).toBe(2);

        expect(
          context.metadata
            .source,
        ).toBe('test');

        expect(
          context.correlation
            .correlationId,
        ).toBe(
          'correlation-one',
        );

        expect(
          context.correlation
            .traceId,
        ).toBe(
          'trace-one',
        );
      },
    );

    it(
      'resolves context expressions',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'projectId',
                type:
                  'string',
                value:
                  'project-one',
                mutable: false,
                secret: false,
              },
            ],
            input: {
              request: {
                id:
                  'request-one',
              },
            },
          });

        expect(
          service.resolve(
            context,
            'variables.projectId',
          ),
        ).toBe(
          'project-one',
        );

        expect(
          service.resolve(
            context,
            '${input.request.id}',
          ),
        ).toBe(
          'request-one',
        );

        expect(
          service.resolve(
            context,
            'input.missing',
          ),
        ).toBeUndefined();
      },
    );

    it(
      'sanitizes nested secrets',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'accessToken',
                type:
                  'string',
                value:
                  'secret-token',
                mutable: true,
                secret: true,
              },
            ],
            input: {
              password:
                'secret-password',
              nested: {
                apiKey:
                  'secret-api-key',
                connection:
                  'postgres://user:password@localhost/db',
              },
            },
          });

        const serialized =
          JSON.stringify(
            context,
          );

        expect(serialized)
          .not.toContain(
            'secret-token',
          );

        expect(serialized)
          .not.toContain(
            'secret-password',
          );

        expect(serialized)
          .not.toContain(
            'secret-api-key',
          );

        expect(serialized)
          .not.toContain(
            'postgres://',
          );

        expect(serialized)
          .toContain(
            '[REDACTED]',
          );
      },
    );

    it(
      'returns independent snapshots',
      () => {
        const context =
          service.create({
            variables: [
              {
                name:
                  'counter',
                type:
                  'number',
                value: 1,
                mutable: true,
                secret: false,
              },
            ],
          });

        const first =
          service.snapshot(
            context,
          );

        const second =
          service.snapshot(
            context,
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(
          first.variables,
        ).not.toBe(
          second.variables,
        );

        expect(
          first.variables
            .counter,
        ).not.toBe(
          second.variables
            .counter,
        );
      },
    );
  },
);