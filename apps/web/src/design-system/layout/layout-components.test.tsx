import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import Panel from "./Panel";
import SplitPanel from "./SplitPanel";
import WorkspaceContent from "./WorkspaceContent";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceShell from "./WorkspaceShell";

describe(
  "workspace layout components",
  () => {
    it(
      "renders workspace shell content",
      () => {
        render(
          <WorkspaceShell>
            <span>
              Workspace
            </span>
          </WorkspaceShell>,
        );

        expect(
          screen.getByText(
            "Workspace",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders header content and actions",
      () => {
        render(
          <WorkspaceHeader
            eyebrow="ENTERPRISE"
            title="Projects"
            description="Manage projects"
            actions={
              <button>
                Create
              </button>
            }
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name: "Projects",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByRole(
            "button",
            {
              name: "Create",
            },
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders panel sections",
      () => {
        render(
          <Panel
            title="Overview"
            footer={
              <span>
                Footer
              </span>
            }
          >
            Content
          </Panel>,
        );

        expect(
          screen.getByText(
            "Overview",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Content",
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "Footer",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders split panels",
      () => {
        render(
          <SplitPanel
            primary={
              <span>
                Primary
              </span>
            }
            secondary={
              <span>
                Secondary
              </span>
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
            "Secondary",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "renders workspace content",
      () => {
        render(
          <WorkspaceContent>
            Body
          </WorkspaceContent>,
        );

        expect(
          screen.getByText(
            "Body",
          ),
        ).toBeInTheDocument();
      },
    );
  },
);
