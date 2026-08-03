import {
  JobEngineService,
} from './job-engine.service';
import {
  JobSchedulerService,
} from './job-scheduler.service';
import {
  JobStateMachineService,
} from './job-state-machine.service';

describe(
  'JobSchedulerService',
  () => {
    function setup() {
      const engine =
        new JobEngineService(
          new JobStateMachineService(),
        );

      const scheduler =
        new JobSchedulerService(
          engine,
        );

      return {
        engine,
        scheduler,
      };
    }

    it(
      'creates immediate schedules',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        const schedule =
          scheduler.createSchedule({
            id:
              'schedule-one',
            jobId:
              'job-one',
            definition: {
              kind:
                'immediate',
              enqueueAt:
                '2026-08-05T10:00:00.000Z',
            },
          });

        expect(
          schedule.nextRunAt,
        ).toBe(
          '2026-08-05T10:00:00.000Z',
        );

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('scheduled');
      },
    );

    it(
      'creates delayed schedules',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
          type: 'delayed',
        });

        const schedule =
          scheduler.createSchedule({
            jobId:
              'job-one',
            definition: {
              kind: 'delayed',
              runAt:
                '2026-08-05T12:00:00.000Z',
              delayMs:
                7_200_000,
            },
          });

        expect(
          schedule.definition.kind,
        ).toBe('delayed');

        expect(
          schedule.nextRunAt,
        ).toBe(
          '2026-08-05T12:00:00.000Z',
        );
      },
    );

    it(
      'creates interval schedules',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
          type: 'recurring',
        });

        const schedule =
          scheduler.createSchedule({
            id:
              'schedule-one',
            jobId:
              'job-one',
            definition: {
              kind:
                'interval',
              intervalMs:
                60_000,
              startAt:
                '2026-08-05T10:00:00.000Z',
              runImmediately:
                false,
              maximumRuns: 3,
            },
          });

        expect(
          schedule.nextRunAt,
        ).toBe(
          '2026-08-05T10:00:00.000Z',
        );
      },
    );

    it(
      'calculates recurring interval runs',
      () => {
        const {
          scheduler,
        } = setup();

        const result =
          scheduler.calculateNextRun(
            {
              kind:
                'interval',
              intervalMs:
                60_000,
              startAt:
                '2026-08-05T10:00:00.000Z',
              runImmediately:
                false,
            },
            '2026-08-05T10:00:30.000Z',
            0,
          );

        expect(result).toBe(
          '2026-08-05T10:01:00.000Z',
        );
      },
    );

    it(
      'calculates basic cron runs',
      () => {
        const {
          scheduler,
        } = setup();

        const hourly =
          scheduler.calculateNextRun(
            {
              kind: 'cron',
              expression:
                '0 * * * *',
              timezone:
                'UTC',
            },
            '2026-08-05T10:15:00.000Z',
            0,
          );

        expect(hourly).toBe(
          '2026-08-05T11:00:00.000Z',
        );

        const everyFiveMinutes =
          scheduler.calculateNextRun(
            {
              kind: 'cron',
              expression:
                '*/5 * * * *',
              timezone:
                'UTC',
            },
            '2026-08-05T10:11:00.000Z',
            0,
          );

        expect(
          everyFiveMinutes,
        ).toBe(
          '2026-08-05T10:15:00.000Z',
        );
      },
    );

    it(
      'finds due schedules',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'immediate',
            enqueueAt:
              '2026-08-05T10:00:00.000Z',
          },
        });

        expect(
          scheduler.getDueSchedules(
            '2026-08-05T10:00:00.000Z',
          ),
        ).toHaveLength(1);

        expect(
          scheduler.getDueSchedules(
            '2026-08-05T09:59:00.000Z',
          ),
        ).toHaveLength(0);
      },
    );

    it(
      'processes scheduler ticks',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'immediate',
            enqueueAt:
              '2026-08-05T10:00:00.000Z',
          },
        });

        const result =
          scheduler.tick({
            now:
              '2026-08-05T10:00:00.000Z',
          });

        expect(
          result.dueSchedules,
        ).toBe(1);

        expect(
          result.enqueuedJobs,
        ).toBe(1);

        expect(result.jobIds)
          .toEqual([
            'job-one',
          ]);

        expect(
          engine.getById(
            'job-one',
          )?.state,
        ).toBe('queued');

        expect(
          scheduler.getById(
            'schedule-one',
          )?.enabled,
        ).toBe(false);
      },
    );

    it(
      'advances recurring schedules after ticks',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
          type: 'recurring',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'interval',
            intervalMs:
              60_000,
            startAt:
              '2026-08-05T10:00:00.000Z',
            runImmediately:
              false,
            maximumRuns: 2,
          },
        });

        scheduler.tick({
          now:
            '2026-08-05T10:00:00.000Z',
        });

        const updated =
          scheduler.getById(
            'schedule-one',
          );

        expect(
          updated?.runCount,
        ).toBe(1);

        expect(
          updated?.nextRunAt,
        ).toBe(
          '2026-08-05T10:01:00.000Z',
        );

        expect(
          updated?.enabled,
        ).toBe(true);
      },
    );

    it(
      'disables recurring schedules after maximum runs',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
          type: 'recurring',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'interval',
            intervalMs:
              60_000,
            startAt:
              '2026-08-05T10:00:00.000Z',
            runImmediately:
              false,
            maximumRuns: 1,
          },
        });

        scheduler.tick({
          now:
            '2026-08-05T10:00:00.000Z',
        });

        const updated =
          scheduler.getById(
            'schedule-one',
          );

        expect(
          updated?.runCount,
        ).toBe(1);

        expect(
          updated?.enabled,
        ).toBe(false);

        expect(
          updated?.nextRunAt,
        ).toBeUndefined();
      },
    );

    it(
      'supports enabling and disabling schedules',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'manual',
          },
          enabled: true,
        });

        expect(
          scheduler.disableSchedule(
            'schedule-one',
          ).enabled,
        ).toBe(false);

        expect(
          scheduler.enableSchedule(
            'schedule-one',
          ).enabled,
        ).toBe(true);
      },
    );

    it(
      'triggers manual schedules immediately',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        scheduler.createSchedule({
          id:
            'manual-schedule',
          jobId:
            'job-one',
          definition: {
            kind:
              'manual',
          },
        });

        const execution =
          scheduler.triggerNow(
            'manual-schedule',
          );

        expect(
          execution.jobId,
        ).toBe('job-one');

        expect(
          execution.state,
        ).toBe('queued');
      },
    );

    it(
      'returns independent schedule snapshots',
      () => {
        const {
          engine,
          scheduler,
        } = setup();

        engine.create({
          id: 'job-one',
          name: 'Job one',
        });

        scheduler.createSchedule({
          id:
            'schedule-one',
          jobId:
            'job-one',
          definition: {
            kind:
              'manual',
          },
        });

        const first =
          scheduler.getById(
            'schedule-one',
          );

        const second =
          scheduler.getById(
            'schedule-one',
          );

        expect(first).toEqual(
          second,
        );

        expect(first).not.toBe(
          second,
        );

        expect(
          first?.definition,
        ).not.toBe(
          second?.definition,
        );
      },
    );
  },
);