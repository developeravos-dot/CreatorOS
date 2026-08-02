import {
  useState,
} from "react";

import {
  logger,
} from "./logger";

import {
  clearPerformanceMeasurements,
} from "./performance";

import {
  clearQueryDiagnostics,
} from "./query-diagnostics";

import {
  useDiagnostics,
} from "./useDiagnostics";

export default function DevelopmentDiagnostics() {
  const [
    open,
    setOpen,
  ] = useState(false);

  const {
    logs,
    queries,
    performance,
  } = useDiagnostics();

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <aside
      className={[
        "creatoros-diagnostics",
        open
          ? "creatoros-diagnostics--open"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="creatoros-diagnostics__toggle"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
      >
        Diagnostics
      </button>

      {open ? (
        <section>
          <header>
            <div>
              <span>
                DEVELOPMENT ONLY
              </span>

              <h3>
                CreatorOS Diagnostics
              </h3>
            </div>

            <button
              type="button"
              onClick={() => {
                logger.clear();
                clearQueryDiagnostics();
                clearPerformanceMeasurements();
              }}
            >
              Clear
            </button>
          </header>

          <div className="creatoros-diagnostics__summary">
            <div>
              <strong>
                {logs.length}
              </strong>
              <span>Logs</span>
            </div>

            <div>
              <strong>
                {queries.length}
              </strong>
              <span>Queries</span>
            </div>

            <div>
              <strong>
                {performance.length}
              </strong>
              <span>Timings</span>
            </div>
          </div>

          <article>
            <h4>
              Query diagnostics
            </h4>

            <div className="creatoros-diagnostics__list">
              {queries.length ===
              0 ? (
                <p>
                  No query data yet.
                </p>
              ) : (
                queries.map(
                  (query) => (
                    <div
                      key={
                        query.key
                      }
                    >
                      <strong>
                        {query.key}
                      </strong>

                      <span>
                        {
                          query.status
                        }
                      </span>

                      <small>
                        {query.isFetching
                          ? "fetching"
                          : query.isInvalidated
                            ? "invalidated"
                            : query.hasError
                              ? "error"
                              : "stable"}
                      </small>
                    </div>
                  ),
                )
              )}
            </div>
          </article>

          <article>
            <h4>
              Recent logs
            </h4>

            <div className="creatoros-diagnostics__list">
              {logs
                .slice(0, 20)
                .map(
                  (entry) => (
                    <div
                      key={
                        entry.id
                      }
                    >
                      <strong>
                        {
                          entry.scope
                        }
                      </strong>

                      <span>
                        {
                          entry.level
                        }
                      </span>

                      <small>
                        {
                          entry.message
                        }
                      </small>
                    </div>
                  ),
                )}
            </div>
          </article>
        </section>
      ) : null}
    </aside>
  );
}
