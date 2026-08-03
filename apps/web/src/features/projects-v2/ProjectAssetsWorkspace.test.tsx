import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  PROJECT_ASSETS_STORAGE_KEY,
} from "./project-assets-storage";

import ProjectAssetsWorkspace from "./ProjectAssetsWorkspace";

const project:
  EnterpriseProject = {
    id: "project-assets-ui",
    name: "Assets Project",
    description:
      "Assets workspace project.",
    platform: "YouTube",
    status: "active",
    createdAt:
      "2026-08-01T08:00:00.000Z",
    updatedAt:
      "2026-08-02T08:00:00.000Z",
  };

describe(
  "ProjectAssetsWorkspace",
  () => {
    beforeEach(
      () => {
        window.localStorage
          .clear();
      },
    );

    it(
      "renders an empty workspace",
      () => {
        render(
          <ProjectAssetsWorkspace
            project={project}
          />,
        );

        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Project asset workspace",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            "No assets found",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "uploads asset metadata",
      () => {
        render(
          <ProjectAssetsWorkspace
            project={project}
          />,
        );

        const file =
          new File(
            ["image"],
            "cover.png",
            {
              type:
                "image/png",
            },
          );

        fireEvent.change(
          screen.getByLabelText(
            "Upload project assets",
          ),
          {
            target: {
              files: [
                file,
              ],
            },
          },
        );

        expect(
          screen.getByText(
            "cover.png",
          ),
        ).toBeInTheDocument();

        const totalAssetsSummary =
          screen
            .getByText(
              "Total assets",
            )
            .closest("article");

        expect(totalAssetsSummary)
          .not.toBeNull();

        expect(
          within(
            totalAssetsSummary!,
          ).getByText("1"),
        ).toBeInTheDocument();

        expect(
          window.localStorage
            .getItem(
              PROJECT_ASSETS_STORAGE_KEY,
            ),
        ).toContain(
          "cover.png",
        );
      },
    );

    it(
      "pins and filters assets",
      () => {
        render(
          <ProjectAssetsWorkspace
            project={project}
          />,
        );

        const image =
          new File(
            ["image"],
            "cover.png",
            {
              type:
                "image/png",
            },
          );

        const document =
          new File(
            ["document"],
            "brief.pdf",
            {
              type:
                "application/pdf",
            },
          );

        fireEvent.change(
          screen.getByLabelText(
            "Upload project assets",
          ),
          {
            target: {
              files: [
                image,
                document,
              ],
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Pin cover.png",
            },
          ),
        );

        fireEvent.click(
          screen.getByRole(
            "checkbox",
            {
              name:
                "Pinned only",
            },
          ),
        );

        expect(
          screen.getByText(
            "cover.png",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "brief.pdf",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "archives and restores assets",
      () => {
        render(
          <ProjectAssetsWorkspace
            project={project}
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            "Upload project assets",
          ),
          {
            target: {
              files: [
                new File(
                  ["video"],
                  "episode.mp4",
                  {
                    type:
                      "video/mp4",
                  },
                ),
              ],
            },
          },
        );

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Archive",
            },
          ),
        );

        fireEvent.change(
          screen.getByRole(
            "combobox",
            {
              name:
                "Filter asset status",
            },
          ),
          {
            target: {
              value:
                "archived",
            },
          },
        );

        expect(
          screen.getByText(
            "archived",
          ),
        ).toBeInTheDocument();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Restore",
            },
          ),
        );

        expect(
          screen.getByText(
            "No assets found",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "searches asset names",
      () => {
        render(
          <ProjectAssetsWorkspace
            project={project}
          />,
        );

        fireEvent.change(
          screen.getByLabelText(
            "Upload project assets",
          ),
          {
            target: {
              files: [
                new File(
                  ["a"],
                  "thumbnail.png",
                  {
                    type:
                      "image/png",
                  },
                ),
                new File(
                  ["b"],
                  "script.pdf",
                  {
                    type:
                      "application/pdf",
                  },
                ),
              ],
            },
          },
        );

        fireEvent.change(
          screen.getByRole(
            "searchbox",
            {
              name:
                "Search project assets",
            },
          ),
          {
            target: {
              value:
                "thumbnail",
            },
          },
        );

        expect(
          screen.getByText(
            "thumbnail.png",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "script.pdf",
          ),
        ).not.toBeInTheDocument();
      },
    );
  },
);
