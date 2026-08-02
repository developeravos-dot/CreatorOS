import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

export type DataTableSortDirection =
  | "asc"
  | "desc";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  width?: string;
  sortable?: boolean;

  sortValue?: (
    row: T,
  ) => string | number;

  render: (
    row: T,
  ) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];

  getRowId: (
    row: T,
  ) => string;

  loading?: boolean;
  loadingRows?: number;
  selectedRowId?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;

  onRowSelect?: (
    row: T,
  ) => void;
}

function compareValues(
  left: string | number,
  right: string | number,
): number {
  if (
    typeof left === "number" &&
    typeof right === "number"
  ) {
    return left - right;
  }

  return String(left).localeCompare(
    String(right),
    undefined,
    {
      numeric: true,
      sensitivity: "base",
    },
  );
}

export default function DataTable<T>({
  rows,
  columns,
  getRowId,
  loading = false,
  loadingRows = 5,
  selectedRowId,
  emptyTitle = "No data available",
  emptyDescription,
  className = "",
  onRowSelect,
}: DataTableProps<T>) {
  const [
    sortColumnId,
    setSortColumnId,
  ] = useState<string | null>(
    null,
  );

  const [
    sortDirection,
    setSortDirection,
  ] = useState<DataTableSortDirection>(
    "asc",
  );

  const sortedRows =
    useMemo(() => {
      if (!sortColumnId) {
        return rows;
      }

      const column =
        columns.find(
          (item) =>
            item.id ===
            sortColumnId,
        );

      if (
        !column?.sortable ||
        !column.sortValue
      ) {
        return rows;
      }

      return [...rows].sort(
        (left, right) => {
          const leftValue =
            column.sortValue?.(
              left,
            ) ?? "";

          const rightValue =
            column.sortValue?.(
              right,
            ) ?? "";

          const result =
            compareValues(
              leftValue,
              rightValue,
            );

          return sortDirection ===
            "asc"
            ? result
            : -result;
        },
      );
    }, [
      columns,
      rows,
      sortColumnId,
      sortDirection,
    ]);

  function handleSort(
    column:
      DataTableColumn<T>,
  ): void {
    if (
      !column.sortable ||
      !column.sortValue
    ) {
      return;
    }

    if (
      sortColumnId ===
      column.id
    ) {
      setSortDirection(
        (current) =>
          current === "asc"
            ? "desc"
            : "asc",
      );

      return;
    }

    setSortColumnId(
      column.id,
    );

    setSortDirection(
      "asc",
    );
  }

  if (
    !loading &&
    rows.length === 0
  ) {
    return (
      <EmptyState
        compact
        title={emptyTitle}
        description={
          emptyDescription
        }
      />
    );
  }

  return (
    <div
      className={[
        "cos-data-table-wrapper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <table className="cos-data-table">
        <thead>
          <tr>
            {columns.map(
              (column) => (
                <th
                  key={column.id}
                  style={{
                    width:
                      column.width,
                  }}
                >
                  <button
                    type="button"
                    className={[
                      "cos-data-table__sort",
                      !column.sortable
                        ? "cos-data-table__sort--static"
                        : "",
                    ]
                      .filter(
                        Boolean,
                      )
                      .join(" ")}
                    disabled={
                      !column.sortable
                    }
                    onClick={() =>
                      handleSort(
                        column,
                      )
                    }
                  >
                    <span>
                      {
                        column.header
                      }
                    </span>

                    {column.sortable ? (
                      <span
                        aria-hidden="true"
                      >
                        {sortColumnId ===
                        column.id
                          ? sortDirection ===
                            "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    ) : null}
                  </button>
                </th>
              ),
            )}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({
                length:
                  loadingRows,
              }).map(
                (
                  _,
                  rowIndex,
                ) => (
                  <tr
                    key={`loading-${rowIndex}`}
                  >
                    {columns.map(
                      (
                        column,
                        columnIndex,
                      ) => (
                        <td
                          key={
                            column.id
                          }
                        >
                          <Skeleton
                            height={
                              columnIndex ===
                              0
                                ? 18
                                : 14
                            }
                            width={
                              columnIndex ===
                              0
                                ? "72%"
                                : "55%"
                            }
                          />
                        </td>
                      ),
                    )}
                  </tr>
                ),
              )
            : sortedRows.map(
                (row) => {
                  const rowId =
                    getRowId(
                      row,
                    );

                  const selected =
                    rowId ===
                    selectedRowId;

                  return (
                    <tr
                      key={rowId}
                      className={
                        selected
                          ? "cos-data-table__row--selected"
                          : ""
                      }
                      tabIndex={
                        onRowSelect
                          ? 0
                          : undefined
                      }
                      onClick={() =>
                        onRowSelect?.(
                          row,
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          !onRowSelect
                        ) {
                          return;
                        }

                        if (
                          event.key ===
                            "Enter" ||
                          event.key ===
                            " "
                        ) {
                          event.preventDefault();

                          onRowSelect(
                            row,
                          );
                        }
                      }}
                    >
                      {columns.map(
                        (column) => (
                          <td
                            key={
                              column.id
                            }
                          >
                            {
                              column.render(
                                row,
                              )
                            }
                          </td>
                        ),
                      )}
                    </tr>
                  );
                },
              )}
        </tbody>
      </table>
    </div>
  );
}
