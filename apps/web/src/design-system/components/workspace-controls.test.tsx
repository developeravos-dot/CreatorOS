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

import LoadingPanel from "./LoadingPanel";
import SearchField from "./SearchField";
import SelectFilter from "./SelectFilter";
import WorkspaceToolbar from "./WorkspaceToolbar";

describe(
  "workspace controls",
  () => {
    it(
      "updates search value",
      () => {
        const onChange =
          vi.fn();

        render(
          <SearchField
            value=""
            onChange={onChange}
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "searchbox",
          ),
          {
            target: {
              value: "project",
            },
          },
        );

        expect(
          onChange,
        ).toHaveBeenCalledWith(
          "project",
        );
      },
    );

    it(
      "changes select filter",
      () => {
        const onChange =
          vi.fn();

        render(
          <SelectFilter
            value="all"
            label="Status"
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "active",
                label: "Active",
              },
            ]}
            onChange={onChange}
          />,
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
          ),
          {
            target: {
              value: "active",
            },
          },
        );

        expect(
          onChange,
        ).toHaveBeenCalledWith(
          "active",
        );
      },
    );

    it(
      "renders toolbar slots",
      () => {
        render(
          <WorkspaceToolbar
            primary={
              <span>
                Primary
              </span>
            }
            filters={
              <span>
                Filters
              </span>
            }
            actions={
              <button>
                Action
              </button>
            }
          />,
        );

        expect(
          screen.getByText(
            "Primary",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Filters",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Action",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders loading panel",
      () => {
        const {
          container,
        } = render(
          <LoadingPanel
            rows={3}
          />,
        );

        expect(
          container.querySelectorAll(
            ".cos-skeleton",
          ),
        ).toHaveLength(4);
      },
    );
  },
);
