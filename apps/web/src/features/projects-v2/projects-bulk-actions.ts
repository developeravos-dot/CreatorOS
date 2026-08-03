export interface BulkActionResult {
  readonly succeeded: readonly string[];
  readonly failed: readonly string[];
}

export async function runBulkAction(
  projectIds: readonly string[],
  executor: (
    projectId: string,
  ) => Promise<boolean>,
): Promise<BulkActionResult> {
  const succeeded: string[] = [];
  const failed: string[] = [];

  for (const projectId of projectIds) {
    try {
      const ok = await executor(
        projectId,
      );

      if (ok) {
        succeeded.push(
          projectId,
        );
      } else {
        failed.push(
          projectId,
        );
      }
    } catch {
      failed.push(
        projectId,
      );
    }
  }

  return {
    succeeded,
    failed,
  };
}
