export type ExecutionJobRunState =
  | "completed"
  | "failed"
  | "waiting-approval"
  | "no-steps";

export interface ExecutionJobRunResult {
  jobId: string;
  state: ExecutionJobRunState;
  executedSteps: number;
  failedSteps: number;
  waitingStepId: string | null;
  errorMessage: string | null;
}