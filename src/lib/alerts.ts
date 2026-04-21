"use client";

import { useAlert } from "@/contexts/AlertContext";

// Re-export the alert hook for convenience
export { useAlert };

// Helper functions for common alert patterns
export function useAlerts() {
  const alert = useAlert();
  
  return {
    // Success alerts
    success: (message: string, title: string = "Success") => {
      return alert.success(title, message);
    },
    
    // Error alerts
    error: (message: string, title: string = "Error") => {
      return alert.error(title, message);
    },
    
    // Warning alerts
    warning: (message: string, title: string = "Warning") => {
      return alert.warning(title, message);
    },
    
    // Info alerts
    info: (message: string, title: string = "Information") => {
      return alert.info(title, message);
    },
    
    // Cinematic alerts (for admin/creative actions)
    cinematic: (message: string, title: string = "Production Update") => {
      return alert.cinematic(title, message);
    },
    
    // Quick success for common actions
    saved: () => alert.success("Saved", "Changes saved successfully"),
    deleted: () => alert.success("Deleted", "Item deleted successfully"),
    created: () => alert.success("Created", "Item created successfully"),
    updated: () => alert.success("Updated", "Item updated successfully"),
    
    // Quick errors
    saveError: (error?: string) => alert.error(error || "Failed to save changes", "Save Failed"),
    deleteError: (error?: string) => alert.error(error || "Failed to delete item", "Delete Failed"),
    loadError: (error?: string) => alert.error(error || "Failed to load data", "Load Failed"),
  };
}