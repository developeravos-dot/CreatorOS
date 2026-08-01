import { styles } from "../../styles/appStyles";

interface CompactItemProps {
  title: string;
  subtitle: string;
}

export default function CompactItem(
  props: CompactItemProps,
) {
  return (
    <div style={styles.compactItem}>
      <div style={styles.compactDot} />

      <div>
        <strong>{props.title}</strong>

        <div style={styles.mutedSmall}>
          {props.subtitle}
        </div>
      </div>
    </div>
  );
}
