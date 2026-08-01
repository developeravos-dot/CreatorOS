import { useState } from "react";

import type { EnterprisePrompt } from "../enterprise-api";

import { EmptyState } from "../components/shared";
import { styles } from "../styles/appStyles";

interface PromptsPageProps {
  prompts: EnterprisePrompt[];
  busy: boolean;
  onCreate: () => Promise<void>;
}

export default function PromptsPage(
  props: PromptsPageProps,
) {
  const [copyMessage, setCopyMessage] = useState("");

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage("تم نسخ القالب بنجاح.");

      window.setTimeout(() => {
        setCopyMessage("");
      }, 2500);
    } catch {
      setCopyMessage("تعذر نسخ القالب.");
    }
  };

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <div style={styles.eyebrow}>
            AI PROMPT LIBRARY
          </div>

          <h2 style={styles.panelTitle}>
            مكتبة القوالب الذكية
          </h2>
        </div>

        <button
          type="button"
          style={styles.primaryButton}
          disabled={props.busy}
          onClick={() => void props.onCreate()}
        >
          ＋ إضافة قالب
        </button>
      </div>

      {copyMessage && (
        <div style={styles.successMessage}>
          {copyMessage}
        </div>
      )}

      {props.prompts.length === 0 ? (
        <EmptyState text="لا توجد قوالب ذكاء اصطناعي حتى الآن." />
      ) : (
        <div style={styles.cardsGrid}>
          {props.prompts.map((prompt) => (
            <article
              key={prompt.id}
              style={styles.itemCard}
            >
              <div style={styles.cardTop}>
                <span style={styles.badge}>
                  AI Prompt
                </span>

                <span style={styles.platform}>
                  ✦ CreatorOS
                </span>
              </div>

              <h3 style={styles.itemTitle}>
                {prompt.name}
              </h3>

              <p style={styles.itemDescription}>
                {prompt.purpose ||
                  "قالب ذكاء اصطناعي"}
              </p>

              <div style={styles.promptText}>
                {prompt.prompt}
              </div>

              <button
                type="button"
                style={styles.primarySmallButton}
                onClick={() =>
                  void copyPrompt(prompt.prompt)
                }
              >
                نسخ القالب
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
