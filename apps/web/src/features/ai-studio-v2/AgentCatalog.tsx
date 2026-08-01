import type { StudioAgent } from "./types";

interface AgentCatalogProps {
  agents: StudioAgent[];
  selectedAgentId?: string;
  search: string;
  category: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSelect: (agent: StudioAgent) => void;
}

export default function AgentCatalog({
  agents,
  selectedAgentId,
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onSelect,
}: AgentCatalogProps) {
  const categories = Array.from(
    new Set(agents.map((agent) => agent.category)),
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      agent.name.toLowerCase().includes(normalizedSearch) ||
      agent.role.toLowerCase().includes(normalizedSearch) ||
      agent.description.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      category === "all" || agent.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="ai-studio-catalog">
      <header className="ai-studio-section-header">
        <div>
          <span>AGENT CATALOG</span>
          <h3>AI workforce</h3>
        </div>

        <small>{filteredAgents.length}</small>
      </header>

      <div className="ai-studio-catalog__filters">
        <label>
          <span>⌕</span>

          <input
            type="search"
            value={search}
            placeholder="Search agents..."
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All categories</option>

          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="ai-studio-catalog__list">
        {filteredAgents.map((agent) => (
          <button
            type="button"
            key={agent.id}
            className={[
              "ai-studio-agent-card",
              selectedAgentId === agent.id
                ? "ai-studio-agent-card--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(agent)}
          >
            <span className="ai-studio-agent-card__icon">
              {agent.icon}
            </span>

            <span className="ai-studio-agent-card__content">
              <strong>{agent.name}</strong>
              <small>{agent.role}</small>
            </span>

            <span
              className={`ai-studio-agent-status ai-studio-agent-status--${agent.status}`}
            >
              {agent.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
