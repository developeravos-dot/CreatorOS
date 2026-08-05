import { WorkflowRecoveryEngineService } from './workflow-recovery-engine.service';

describe('WorkflowRecoveryEngineService', () => {
  const runtime = {
    id: 'execution-1', workflowId: 'workflow-1', status: 'running' as const,
    maxParallelSteps: 1, activeStepIds: ['step-1'], createdAt: new Date(), updatedAt: new Date(), completedAt: null,
    steps: [{ id:'step-1', name:'Step 1', status:'active' as const, dependsOn:[], attempt:1, maxAttempts:2, retryDelayMs:1000, continueOnFailure:false, input:{}, output:null, metadata:{}, error:null, scheduledRetryId:null, startedAt:new Date(), completedAt:null, createdAt:new Date(), updatedAt:new Date() }],
  };
  const orchestrator={restoreExecutionRuntime:jest.fn()};
  const scheduler={scheduleRetry:jest.fn()};
  const persistenceEngine={restoreExecution:jest.fn()};
  const checkpointEngine={findLatestValid:jest.fn()};
  const executionRepository={listRecoverable:jest.fn()};
  const recoveryRepository={findLatestByExecutionId:jest.fn(),save:jest.fn()};
  const recoveryEntity={create:jest.fn((x)=>x)};
  const eventRepository={nextSequence:jest.fn(),append:jest.fn()};
  const eventEntity={create:jest.fn((x)=>x)};

  beforeEach(()=>{
    jest.clearAllMocks();
    persistenceEngine.restoreExecution.mockResolvedValue(runtime);
    checkpointEngine.findLatestValid.mockResolvedValue({id:'checkpoint-1'});
    recoveryRepository.findLatestByExecutionId.mockResolvedValue(null);
    recoveryRepository.save.mockImplementation(async x=>x);
    eventRepository.nextSequence.mockResolvedValue(1);
    eventRepository.append.mockImplementation(async x=>x);
  });

  const create=()=>new WorkflowRecoveryEngineService(orchestrator as never,scheduler as never,persistenceEngine as never,checkpointEngine as never,executionRepository as never,recoveryRepository as never,recoveryEntity as never,eventRepository as never,eventEntity as never,{mode:'MANUAL'});

  it('recovers an active step as ready and restores it into orchestrator', async()=>{
    await expect(create().startRecovery('execution-1')).resolves.toEqual(expect.objectContaining({status:'recovered'}));
    expect(orchestrator.restoreExecutionRuntime).toHaveBeenCalledWith(expect.objectContaining({activeStepIds:[],steps:[expect.objectContaining({status:'ready'})]}));
    expect(eventRepository.append).toHaveBeenCalledWith(expect.objectContaining({type:'workflow.recovered'}));
  });

  it('deduplicates concurrent recovery requests', async()=>{
    let resolve!: (value: unknown)=>void;
    persistenceEngine.restoreExecution.mockReturnValue(new Promise(r=>{resolve=r;}));
    const service=create();
    const a=service.startRecovery('execution-1');
    const b=service.startRecovery('execution-1');
    expect(a).toBe(b);
    resolve(runtime);
    await a;
  });

  it('auto-recovers persisted recoverable executions', async()=>{
    executionRepository.listRecoverable.mockResolvedValue([{id:'execution-1'}]);
    const service=new WorkflowRecoveryEngineService(orchestrator as never,scheduler as never,persistenceEngine as never,checkpointEngine as never,executionRepository as never,recoveryRepository as never,recoveryEntity as never,eventRepository as never,eventEntity as never,{mode:'AUTO'});
    await service.onApplicationBootstrap();
    expect(orchestrator.restoreExecutionRuntime).toHaveBeenCalled();
  });

  it('records recovery failure', async()=>{
    persistenceEngine.restoreExecution.mockRejectedValue(new Error('restore failed'));
    await expect(create().startRecovery('execution-1')).resolves.toEqual(expect.objectContaining({status:'failed',errorMessage:'restore failed'}));
    expect(eventRepository.append).toHaveBeenCalledWith(expect.objectContaining({type:'workflow.recovery.failed'}));
  });
});
