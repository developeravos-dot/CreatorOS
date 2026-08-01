import { styles } from "../../styles/appStyles";

interface EmptyStateProps {
  text: string;
}

export default function EmptyState(
  props: EmptyStateProps,
) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>▣</div>
      <div>{props.text}</div>
    </div>
  );
}
