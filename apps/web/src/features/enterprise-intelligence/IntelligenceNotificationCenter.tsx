import {
  useMemo,
  useState,
} from "react";

import {
  buildIntelligenceNotifications,
  summarizeNotifications,
} from "./enterprise-notification-engine";

import type {
  EnterpriseIntelligenceSnapshot,
} from "./enterprise-intelligence-types";

import type {
  IntelligenceNotification,
  IntelligenceNotificationCategory,
} from "./enterprise-notification-types";

interface IntelligenceNotificationCenterProps {
  intelligence:
    EnterpriseIntelligenceSnapshot;
}

const categories: Array<{
  id: IntelligenceNotificationCategory;
  label: string;
}> = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "project",
    label: "Projects",
  },
  {
    id: "script",
    label: "Scripts",
  },
  {
    id: "calendar",
    label: "Calendar",
  },
  {
    id: "prompt",
    label: "Prompts",
  },
  {
    id: "system",
    label: "System",
  },
];

export default function IntelligenceNotificationCenter({
  intelligence,
}: IntelligenceNotificationCenterProps) {
  const [
    readIds,
    setReadIds,
  ] = useState<
    Set<string>
  >(
    () => new Set(),
  );

  const [
    category,
    setCategory,
  ] = useState<
    IntelligenceNotificationCategory
  >("all");

  const notifications =
    useMemo<
      IntelligenceNotification[]
    >(
      () =>
        buildIntelligenceNotifications(
          intelligence,
        ).map(
          (notification) => ({
            ...notification,
            read:
              readIds.has(
                notification.id,
              ),
          }),
        ),
      [
        intelligence,
        readIds,
      ],
    );

  const summary =
    useMemo(
      () =>
        summarizeNotifications(
          notifications,
        ),
      [notifications],
    );

  const filteredNotifications =
    useMemo(
      () =>
        category === "all"
          ? notifications
          : notifications.filter(
              (notification) =>
                notification.category ===
                category,
            ),
      [
        category,
        notifications,
      ],
    );

  function toggleRead(
    id: string,
  ): void {
    setReadIds(
      (current) => {
        const next =
          new Set(current);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      },
    );
  }

  function markAllRead(): void {
    setReadIds(
      new Set(
        notifications.map(
          (notification) =>
            notification.id,
        ),
      ),
    );
  }

  return (
    <article className="enterprise-intelligence-panel">
      <header className="enterprise-intelligence-panel__header">
        <div>
          <span>
            NOTIFICATION CENTER
          </span>

          <h3>
            Intelligent alerts
          </h3>
        </div>

        <button
          type="button"
          disabled={
            summary.unread === 0
          }
          onClick={markAllRead}
        >
          Mark all read
        </button>
      </header>

      <section className="enterprise-notification-summary">
        <div>
          <strong>
            {summary.unread}
          </strong>
          <span>Unread</span>
        </div>

        <div>
          <strong>
            {summary.critical}
          </strong>
          <span>Critical</span>
        </div>

        <div>
          <strong>
            {summary.warning}
          </strong>
          <span>Warning</span>
        </div>

        <div>
          <strong>
            {summary.info}
          </strong>
          <span>Info</span>
        </div>
      </section>

      <div className="enterprise-notification-filters">
        {categories.map(
          (item) => (
            <button
              type="button"
              key={item.id}
              className={
                category === item.id
                  ? "enterprise-notification-filter--active"
                  : ""
              }
              onClick={() =>
                setCategory(item.id)
              }
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      <div className="enterprise-notification-list">
        {filteredNotifications.length ===
        0 ? (
          <div className="enterprise-intelligence-empty">
            No notifications
            available.
          </div>
        ) : (
          filteredNotifications.map(
            (notification) => (
              <button
                type="button"
                className={[
                  "enterprise-notification-item",
                  `enterprise-notification-item--${notification.severity}`,
                  notification.read
                    ? "enterprise-notification-item--read"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={
                  notification.id
                }
                onClick={() =>
                  toggleRead(
                    notification.id,
                  )
                }
              >
                <span />

                <section>
                  <header>
                    <strong>
                      {
                        notification.title
                      }
                    </strong>

                    <small>
                      {
                        notification.category
                      }
                    </small>
                  </header>

                  <p>
                    {
                      notification.message
                    }
                  </p>

                  <time>
                    {new Date(
                      notification.timestamp,
                    ).toLocaleString()}
                  </time>
                </section>
              </button>
            ),
          )
        )}
      </div>
    </article>
  );
}
