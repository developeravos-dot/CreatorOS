import { RuntimeService } from './runtime.service';

describe('RuntimeService', () => {
  let service: RuntimeService;

  beforeEach(() => {
    service = new RuntimeService();
    service.onModuleInit();
  });

  it('should bootstrap built-in plugins', () => {
    const status =
      service.getHealth();

    expect(status.bootstrapped)
      .toBe(true);

    expect(status.plugins)
      .toBe(6);

    expect(status.started)
      .toBe(6);

    expect(status.failed)
      .toBe(0);
  });

  it('should expose active capabilities', () => {
    const capabilities =
      service.getCapabilities();

    expect(capabilities.count)
      .toBeGreaterThanOrEqual(9);

    expect(
      capabilities.capabilities.every(
        (capability) =>
          capability.status ===
          'active',
      ),
    ).toBe(true);
  });

  it('should register and start a custom plugin', () => {
    const plugin =
      service.registerPlugin({
        key:
          'avos.custom-plugin',
        name:
          'AVOS Custom Plugin',
        version: '0.1.0',
        type: 'extension',
        runtimeCompatibility:
          '^0.1.0',
        enabled: true,
        autoStart: false,
        dependencies: [
          {
            pluginKey:
              'creatoros.core',
            minimumVersion:
              '0.1.0',
          },
        ],
        capabilities: [
          {
            key:
              'avos.custom-capability',
            name:
              'AVOS Custom Capability',
          },
        ],
      });

    service.validatePlugin(
      plugin.manifest.id,
    );

    service.loadPlugin(
      plugin.manifest.id,
    );

    const started =
      service.startPlugin(
        plugin.manifest.id,
      );

    expect(started.status)
      .toBe('started');

    expect(
      service.getCapability(
        'avos.custom-capability',
      )?.status,
    ).toBe('active');
  });

  it('should disable and enable an inactive plugin', () => {
    const plugin =
      service.registerPlugin({
        key: 'avos.toggle-plugin',
        name: 'AVOS Toggle Plugin',
        version: '0.1.0',
        type: 'extension',
        enabled: true,
        autoStart: false,
      });

    const disabled =
      service.disablePlugin(
        plugin.manifest.id,
      );

    expect(disabled.status)
      .toBe('disabled');

    const enabled =
      service.enablePlugin(
        plugin.manifest.id,
      );

    expect(enabled.status)
      .toBe('registered');
  });

  it('should record lifecycle events', () => {
    const events =
      service.getLifecycleEvents();

    expect(events.count)
      .toBeGreaterThan(0);

    expect(
      events.events.some(
        (event) =>
          event.action ===
          'started',
      ),
    ).toBe(true);
  });

  it('should expose operational health', () => {
    const health =
      service.getHealth();

    expect(health.status)
      .toBe('operational');

    expect(health.runtime)
      .toBe('@creatoros/runtime');

    expect(health.provider)
      .toBe(
        'InMemoryRuntimeEngine',
      );
  });
});


