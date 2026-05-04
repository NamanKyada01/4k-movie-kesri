"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

// Component to force themes based on routes
function ThemeEnforcer({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if current route is an admin route
    const isAdminRoute = pathname?.startsWith("/admin");
    
    if (isAdminRoute && theme !== "dark") {
      setTheme("dark");
    } else if (!isAdminRoute && theme !== "orange-light") {
      setTheme("orange-light");
    }
  }, [pathname, theme, setTheme]);
  
  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="orange-light"
      enableSystem={false}
      themes={["dark", "light", "orange-light"]}
    >
      <ThemeEnforcer>
        {children}
      </ThemeEnforcer>
    </NextThemesProvider>
  );
}
