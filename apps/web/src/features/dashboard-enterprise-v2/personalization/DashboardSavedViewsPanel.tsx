import {
  useState,
} from "react";

import type {
  DashboardSavedView,
} from "./dashboard-personalization-types";

interface DashboardSavedViewsPanelProps {
  savedViews:
    DashboardSavedView[];

  activeViewId:
    string | null;

  onSave: (
    name: string,
    description: string,
  ) => void;

  onApply: (
    viewId: string,
  ) => void;

  onUpdateActive: () => void;

  onDelete: (
    viewId: string,
  ) => void;
}

export default function DashboardSavedViewsPanel({
  savedViews,
  activeViewId,
  onSave,
  onApply,
  onUpdateActive,
  onDelete,
}: DashboardSavedViewsPanelProps) {
  const [
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const submit = (): void => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    onSave(
      trimmedName,
      description,
    );

    setName("");
    setDescription("");
  };

  return (
    <div className="dashboard-saved-views">
      <div className="dashboard-saved-views__form">
        <label>
          <span>
            View name
          </span>

          <input
            value={name}
            placeholder="My dashboard view"
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
          />
        </label>

        <label>
          <span>
            Description
          </span>

          <textarea
            value={description}
            placeholder="Describe this layout"
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
          />
        </label>

        <button
          type="button"
          disabled={
            !name.trim()
          }
          onClick={submit}
        >
          Save current view
        </button>
      </div>

      {activeViewId ? (
        <button
          type="button"
          className="dashboard-saved-views__update"
          onClick={
            onUpdateActive
          }
        >
          Update active view
        </button>
      ) : null}

      <div className="dashboard-saved-views__list">
        {savedViews.length === 0 ? (
          <p>
            No saved dashboard views.
          </p>
        ) : (
          savedViews.map(
            (view) => (
              <article
                key={view.id}
                className={
                  view.id ===
                  activeViewId
                    ? "dashboard-saved-views__item dashboard-saved-views__item--active"
                    : "dashboard-saved-views__item"
                }
              >
                <div>
                  <strong>
                    {view.name}
                  </strong>

                  <span>
                    {
                      view.description ||
                      "No description"
                    }
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      onApply(
                        view.id,
                      )
                    }
                  >
                    Apply
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        view.id,
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ),
          )
        )}
      </div>
    </div>
  );
}
