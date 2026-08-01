import { styles } from "../../styles/appStyles";

interface MetricCardProps {
  icon: string;
  label: string;
  value: number;
  note: string;
}

export default function MetricCard(props: MetricCardProps) {
  return (
    <article style={styles.metricCard}>
      <div style={styles.metricIcon}>{props.icon}</div>
      <div style={styles.metricValue}>{props.value}</div>
      <div style={styles.metricLabel}>{props.label}</div>
      <div style={styles.metricNote}>{props.note}</div>
    </article>
  );
}
