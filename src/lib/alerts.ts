"use client";

import { useAlert } from "@/contexts/AlertContext";
import { toast } from "sonner";

// Re-export the alert hook for convenience
export { useAlert };

// Helper functions for common alert patterns
export function useAlerts() {
  const alert = useAlert();
  
  return {
    // Success alerts
    success: (message: string, title: string = "Success") => {
      return toast.success(`${title}: ${message}`);
    },
    
    // Error alerts
    error: (message: string, title: string = "Error") => {
      return toast.error(`${title}: ${message}`);
    },
    
    // Warning alerts
    warning: (message: string, title: string = "Warning") => {
      return toast.warning(`${title}: ${message}`);
    },
    
    // Info alerts
    info: (message: string, title: string = "Information") => {
      return toast.info(`${title}: ${message}`);
    },
    
    // Cinematic alerts (now using normal toast as per user request)
    cinematic: (message: string, title: string = "Update") => {
      return toast.success(`${title}: ${message}`);
    },

    // Confirmation dialogs (Stay as modal because they need a return value)
    confirm: (message: string, title: string = "Are you sure?") => {
      return alert.confirm(title, message);
    },
    
    // Quick success for common actions
    saved: () => toast.success("Saved: Changes saved successfully"),
    deleted: () => toast.success("Deleted: Item deleted successfully"),
    created: () => toast.success("Created: Item created successfully"),
    updated: () => toast.success("Updated: Item updated successfully"),
    
    // Quick errors
    saveError: (error?: string) => toast.error(`Save Failed: ${error || "Failed to save changes"}`),
    deleteError: (error?: string) => toast.error(`Delete Failed: ${error || "Failed to delete item"}`),
    loadError: (error?: string) => toast.error(`Load Failed: ${error || "Failed to load data"}`),
  };
}