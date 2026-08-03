import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import ProjectsPagination from "./ProjectsPagination";

describe(
  "ProjectsPagination",
  () => {
    it(
      "moves between pages",
      () => {
        const onPageChange =
          vi.fn();

        render(
          <ProjectsPagination
            page={2}
            totalPages={4}
            pageSize={10}
            totalProjects={35}
            onPageChange={
              onPageChange
            }
            onPageSizeChange={
              vi.fn()
            }
          />,
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Previous",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name: "Next",
            },
          ),
        );

        expect(
          onPageChange,
        ).toHaveBeenNthCalledWith(
          1,
          1,
        );

        expect(
          onPageChange,
        ).toHaveBeenNthCalledWith(
          2,
          3,
        );
      },
    );

    it(
      "changes page size",
      () => {
        const onPageSizeChange =
          vi.fn();

        render(
          <ProjectsPagination
            page={1}
            totalPages={4}
            pageSize={10}
            totalProjects={35}
            onPageChange={
              vi.fn()
            }
            onPageSizeChange={
              onPageSizeChange
            }
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Rows per page",
            },
          ),
          {
            target: {
              value: "20",
            },
          },
        );

        expect(
          onPageSizeChange,
        ).toHaveBeenCalledWith(
          20,
        );
      },
    );

    it(
      "disables navigation at boundaries",
      () => {
        render(
          <ProjectsPagination
            page={1}
            totalPages={1}
            pageSize={10}
            totalProjects={1}
            onPageChange={
              vi.fn()
            }
            onPageSizeChange={
              vi.fn()
            }
          />,
        );

        expect(
          screen.getByRole(
            "button",
            {
              name: "Previous",
            },
          ),
        ).toBeDisabled();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Next",
            },
          ),
        ).toBeDisabled();
      },
    );
  },
);
