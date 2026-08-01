import type { StudioAgent } from "./types";

export const studioAgents: StudioAgent[] = [
  {
    id: "strategist",
    name: "Content Strategist",
    role: "Strategy and positioning",
    description:
      "Defines the audience, content goal, platform strategy and success criteria.",
    icon: "◎",
    category: "Strategy",
    status: "ready",
    capabilities: [
      "Audience targeting",
      "Platform strategy",
      "Content positioning",
    ],
  },
  {
    id: "researcher",
    name: "Research Agent",
    role: "Research and evidence",
    description:
      "Collects source material, identifies useful facts and prepares a research brief.",
    icon: "⌕",
    category: "Intelligence",
    status: "ready",
    capabilities: [
      "Topic research",
      "Evidence extraction",
      "Source organization",
    ],
  },
  {
    id: "idea-director",
    name: "Idea Director",
    role: "Concept generation",
    description:
      "Creates differentiated concepts, hooks and content angles for production.",
    icon: "✦",
    category: "Creative",
    status: "ready",
    capabilities: [
      "Concept generation",
      "Hook design",
      "Idea variation",
    ],
  },
  {
    id: "scriptwriter",
    name: "Scriptwriter",
    role: "Script development",
    description:
      "Transforms the approved concept into a structured production-ready script.",
    icon: "✎",
    category: "Writing",
    status: "ready",
    capabilities: [
      "Long-form scripts",
      "Short-form scripts",
      "Scene structure",
    ],
  },
  {
    id: "story-editor",
    name: "Story Editor",
    role: "Narrative quality",
    description:
      "Improves clarity, pacing, retention and narrative consistency.",
    icon: "◇",
    category: "Writing",
    status: "ready",
    capabilities: [
      "Retention editing",
      "Narrative review",
      "Pacing optimization",
    ],
  },
  {
    id: "creative-director",
    name: "Creative Director",
    role: "Visual direction",
    description:
      "Defines the visual language, character direction, shots and production style.",
    icon: "◈",
    category: "Production",
    status: "ready",
    capabilities: [
      "Visual direction",
      "Shot planning",
      "Style consistency",
    ],
  },
  {
    id: "voice-director",
    name: "Voice Director",
    role: "Voice and narration",
    description:
      "Selects voice direction, pacing, emotional delivery and narration structure.",
    icon: "◉",
    category: "Production",
    status: "ready",
    capabilities: [
      "Voice direction",
      "Narration pacing",
      "Delivery guidance",
    ],
  },
  {
    id: "quality-agent",
    name: "Quality Controller",
    role: "Production review",
    description:
      "Reviews the output against quality, originality and consistency requirements.",
    icon: "✓",
    category: "Quality",
    status: "ready",
    capabilities: [
      "Quality review",
      "Consistency validation",
      "Release readiness",
    ],
  },
  {
    id: "publishing-agent",
    name: "Publishing Agent",
    role: "Publishing preparation",
    description:
      "Prepares titles, descriptions, metadata and publishing recommendations.",
    icon: "▣",
    category: "Distribution",
    status: "ready",
    capabilities: [
      "Metadata preparation",
      "Publishing checklist",
      "Platform packaging",
    ],
  },
  {
    id: "analytics-agent",
    name: "Analytics Agent",
    role: "Performance intelligence",
    description:
      "Reviews performance signals and generates recommendations for future production.",
    icon: "⌁",
    category: "Intelligence",
    status: "ready",
    capabilities: [
      "Performance analysis",
      "Learning extraction",
      "Iteration recommendations",
    ],
  },
];
