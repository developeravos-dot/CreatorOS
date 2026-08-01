import type { ReactNode } from "react";

import { styles } from "../styles/appStyles";

interface MainLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export default function MainLayout(
  props: MainLayoutProps,
) {
  return (
    <div style={styles.app} dir="rtl">
      {props.sidebar}

      <main style={styles.main}>
        {props.header}
        {props.children}
      </main>
    </div>
  );
}
