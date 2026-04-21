"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

// Component to force dark theme for admin routes
function AdminThemeEnforcer({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  useEffect(() => {
    // Check if current route is an admin route
    const isAdminRoute = pathname?.startsWith("/admin");
    
    // Force dark theme for admin routes
    if (isAdminRoute && theme !== "dark") {
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
      themes={["dark", "light"]}
    >
      <AdminThemeEnforcer>
        {children}
      </AdminThemeEnforcer>
    </NextThemesProvider>
  );
}
