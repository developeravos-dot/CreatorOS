import { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export default function Content({ children }: ContentProps) {
  return (
    <main
      style={{
        padding: 32,
        overflow: "auto",
      }}
    >
      {children}
    </main>
  );
}
