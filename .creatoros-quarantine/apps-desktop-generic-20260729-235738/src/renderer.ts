type Page =
  | 'dashboard'
  | 'projects'
  | 'builder'
  | 'ai'
  | 'security'
  | 'operations'
  | 'settings';

const pages: Record<Page, HTMLElement> =
  {} as Record<Page, HTMLElement>;

function byId<T extends HTMLElement>(
  id: string,
): T {
  const element =
    document.getElementById(id);

  if (!element) {
    throw new Error(
      `Element not found: ${id}`,
    );
  }

  return element as T;
}

function showPage(page: Page) {
  for (const [key, element] of
    Object.entries(pages)) {
    element.hidden = key !== page;
  }

  document
    .querySelectorAll('[data-page]')
    .forEach((element) => {
      element.classList.toggle(
        'active',
        element.getAttribute(
          'data-page',
        ) === page,
      );
    });
}

function setText(
  id: string,
  value: unknown,
) {
  byId(id).textContent =
    typeof value === 'string'
      ? value
      : JSON.stringify(
          value,
          null,
          2,
        );
}

async function loadSystemStatus() {
  const targets = [
    {
      id: 'platform-status',
      endpoint:
        '/platform/core/status',
    },
    {
      id: 'intelligence-status',
      endpoint:
        '/intelligence/core/status',
    },
    {
      id: 'security-status',
      endpoint:
        '/trust/security/status',
    },
    {
      id: 'operations-status',
      endpoint:
        '/extension/operations/status',
    },
    {
      id: 'production-status',
      endpoint:
        '/production/final/status',
    },
  ];

  await Promise.all(
    targets.map(async (target) => {
      try {
        const result =
          await window.creatorOS.api(
            target.endpoint,
          );

        const status =
          (result as {
            status?: string;
          })?.status ?? 'operational';

        setText(
          target.id,
          status,
        );
      } catch {
        setText(
          target.id,
          'offline',
        );
      }
    }),
  );
}

function bindNavigation() {
  document
    .querySelectorAll<HTMLElement>(
      '[data-page]',
    )
    .forEach((item) => {
      item.addEventListener(
        'click',
        () => {
          showPage(
            item.dataset.page as Page,
          );
        },
      );
    });
}

function bindProjectBuilder() {
  const form =
    byId<HTMLFormElement>(
      'project-form',
    );

  form.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      const name =
        byId<HTMLInputElement>(
          'project-name',
        ).value.trim();

      const description =
        byId<HTMLTextAreaElement>(
          'project-description',
        ).value.trim();

      const type =
        byId<HTMLSelectElement>(
          'project-type',
        ).value;

      setText(
        'builder-output',
        {
          status: 'blueprint-created',
          project: {
            name,
            type,
            description,
          },
          pipeline: [
            'Requirements analysis',
            'Architecture blueprint',
            'Capability mapping',
            'Implementation planning',
            'Human approval gate',
          ],
          note:
            'Execution engine integration is the next desktop pack.',
        },
      );
    },
  );
}

function bindAIWorkspace() {
  const button =
    byId<HTMLButtonElement>(
      'ai-run',
    );

  button.addEventListener(
    'click',
    async () => {
      const mission =
        byId<HTMLTextAreaElement>(
          'ai-mission',
        ).value.trim();

      if (!mission) {
        setText(
          'ai-output',
          'Enter an AI mission first.',
        );
        return;
      }

      setText(
        'ai-output',
        {
          status: 'mission-prepared',
          mission,
          organization: [
            'Research Agent',
            'Architecture Agent',
            'Engineering Agent',
            'Security Agent',
            'Quality Agent',
          ],
          governance:
            'Human Final Authority',
        },
      );
    },
  );
}

async function bindEnvironment() {
  const environment =
    await window.creatorOS.environment();

  setText(
    'environment-output',
    environment,
  );

  byId<HTMLInputElement>(
    'api-url',
  ).value = environment.apiBase;
}

document.addEventListener(
  'DOMContentLoaded',
  async () => {
    (
      [
        'dashboard',
        'projects',
        'builder',
        'ai',
        'security',
        'operations',
        'settings',
      ] as Page[]
    ).forEach((page) => {
      pages[page] = byId(
        `page-${page}`,
      );
    });

    bindNavigation();
    bindProjectBuilder();
    bindAIWorkspace();
    await bindEnvironment();
    await loadSystemStatus();
    showPage('dashboard');

    byId('refresh-status')
      .addEventListener(
        'click',
        loadSystemStatus,
      );
  },
);