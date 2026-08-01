import { styles } from "../../styles/appStyles";

interface SystemRowProps {
  label: string;
  value: string;
}

export default function SystemRow(
  props: SystemRowProps,
) {
  const displayValue =
    props.value === "ready"
      ? "جاهز"
      : props.value === "persistent"
        ? "دائم"
        : props.value;

  return (
    <div style={styles.systemRow}>
      <span>{props.label}</span>

      <strong style={styles.systemValue}>
        {displayValue}
      </strong>
    </div>
  );
}
