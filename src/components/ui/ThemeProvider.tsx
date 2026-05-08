"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

// Component to force themes based on routes
function ThemeEnforcer({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  useEffect(() => {
    if (theme !== "dark") {
      setTheme("dark");
    }
  }, [pathname, theme, setTheme]);
  
  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      <ThemeEnforcer>
        {children}
      </ThemeEnforcer>
    </NextThemesProvider>
  );
}
