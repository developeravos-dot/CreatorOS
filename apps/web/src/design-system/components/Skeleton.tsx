interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

function toCssValue(
  value: string | number,
): string {
  return typeof value === "number"
    ? `${value}px`
    : value;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  radius =
    "var(--cos-radius-sm)",
  className = "",
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "cos-skeleton",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width:
          toCssValue(width),
        height:
          toCssValue(height),
        borderRadius:
          toCssValue(radius),
      }}
    />
  );
}
