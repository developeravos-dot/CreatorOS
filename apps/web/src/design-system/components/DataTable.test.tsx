import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import DataTable, {
  type DataTableColumn,
} from "./DataTable";

interface Row {
  id: string;
  name: string;
  score: number;
}

const rows: Row[] = [
  {
    id: "2",
    name: "Beta",
    score: 20,
  },
  {
    id: "1",
    name: "Alpha",
    score: 10,
  },
];

const columns:
  DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    sortValue:
      (row) => row.name,
    render:
      (row) => row.name,
  },
  {
    id: "score",
    header: "Score",
    sortable: true,
    sortValue:
      (row) => row.score,
    render:
      (row) => row.score,
  },
];

describe(
  "DataTable",
  () => {
    it(
      "renders rows",
      () => {
        render(
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={
              (row) => row.id
            }
          />,
        );

        expect(
          screen.getByText(
            "Alpha",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Beta",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "sorts rows",
      () => {
        render(
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={
              (row) => row.id
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: /Name/,
            },
          ),
        );

        const renderedRows =
          screen
            .getAllByRole("row")
            .slice(1);

        expect(
          renderedRows[0],
        ).toHaveTextContent(
          "Alpha",
        );
      },
    );

    it(
      "selects a row",
      () => {
        const onRowSelect =
          vi.fn();

        render(
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={
              (row) => row.id
            }
            onRowSelect={
              onRowSelect
            }
          />,
        );

        fireEvent.click(
          screen.getByText(
            "Beta",
          ),
        );

        expect(
          onRowSelect,
        ).toHaveBeenCalledWith(
          rows[0],
        );
      },
    );

    it(
      "renders empty state",
      () => {
        render(
          <DataTable
            rows={[]}
            columns={columns}
            getRowId={
              (row) => row.id
            }
            emptyTitle="No rows"
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name: "No rows",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders loading skeletons",
      () => {
        const {
          container,
        } = render(
          <DataTable
            rows={[]}
            columns={columns}
            getRowId={
              (row) => row.id
            }
            loading
            loadingRows={3}
          />,
        );

        expect(
          container.querySelectorAll(
            ".cos-skeleton",
          ),
        ).toHaveLength(6);
      },
    );
  },
);
