import type {
  QuerySnapshot,
} from "../../api/data-engine/QueryClient";

export interface QueryDiagnosticEntry {
  key: string;
  status:
    QuerySnapshot["status"];
  updatedAt: number;
  isInvalidated: boolean;
  isFetching: boolean;
  hasData: boolean;
  hasError: boolean;
}

const diagnostics =
  new Map<
    string,
    QueryDiagnosticEntry
  >();

export function recordQueryDiagnostic(
  snapshot: QuerySnapshot,
): void {
  diagnostics.set(
    snapshot.key,
    {
      key: snapshot.key,
      status:
        snapshot.status,
      updatedAt:
        snapshot.updatedAt,
      isInvalidated:
        snapshot.isInvalidated,
      isFetching:
        snapshot.isFetching,
      hasData:
        snapshot.data !==
        undefined,
      hasError:
        snapshot.error !==
        undefined,
    },
  );
}

export function getQueryDiagnostics():
  QueryDiagnosticEntry[] {
  return [
    ...diagnostics.values(),
  ].sort(
    (left, right) =>
      right.updatedAt -
      left.updatedAt,
  );
}

export function clearQueryDiagnostics():
  void {
  diagnostics.clear();
}
