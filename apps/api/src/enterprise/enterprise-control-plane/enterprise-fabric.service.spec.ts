import { EnterpriseCapabilityFabricService, EnterpriseKnowledgeFabricService, EnterprisePolicyEngineService, EnterpriseServiceMeshService } from './services';

describe('Enterprise platform fabric', () => {
  it('versions and searches knowledge', () => {
    const service = new EnterpriseKnowledgeFabricService();
    service.publish({ recordId: 'record-one', namespace: 'operations', content: 'Initial plan', tags: ['runtime'] });
    service.publish({ recordId: 'record-one', namespace: 'operations', content: 'Updated plan', tags: ['runtime', 'updated'] });
    expect(service.latest('record-one')?.version).toBe(2);
    expect(service.search({ text: 'updated', tags: ['runtime'] })).toHaveLength(1);
  });

  it('resolves highest-priority capability providers', () => {
    const service = new EnterpriseCapabilityFabricService();
    service.register({ capabilityId: 'workflow.execute', providerId: 'provider-a', operation: 'execute', priority: 1, enabled: true });
    service.register({ capabilityId: 'workflow.execute', providerId: 'provider-b', operation: 'execute', priority: 10, enabled: true });
    expect(service.resolve('workflow.execute', 'execute').providerId).toBe('provider-b');
  });

  it('routes healthy least-loaded endpoints', () => {
    const mesh = new EnterpriseServiceMeshService();
    mesh.register({ endpointId: 'endpoint-a', serviceId: 'runtime', region: 'uae', priority: 10 });
    mesh.register({ endpointId: 'endpoint-b', serviceId: 'runtime', region: 'uae', priority: 10 });
    expect(mesh.route('runtime', 'uae').endpointId).toBe('endpoint-a');
    expect(mesh.route('runtime', 'uae').endpointId).toBe('endpoint-b');
  });

  it('applies highest-priority enterprise policy', () => {
    const policies = new EnterprisePolicyEngineService();
    policies.register({ policyId: 'allow', subject: 'admin', action: 'execute', resource: 'workflow', effect: 'allow', priority: 10, enabled: true });
    policies.register({ policyId: 'deny', subject: 'admin', action: 'execute', resource: 'workflow', effect: 'deny', priority: 20, enabled: true });
    expect(policies.evaluate({ subject: 'admin', action: 'execute', resource: 'workflow' }).allowed).toBe(false);
  });
});
