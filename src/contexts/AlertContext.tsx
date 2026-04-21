"use client";

import * as React from "react";
import { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import CustomAlert, { AlertType, CustomAlertProps } from "@/components/ui/CustomAlert";

interface Alert extends Omit<CustomAlertProps, "onClose"> {
  id: string;
}

type AlertAction =
  | { type: "ADD_ALERT"; alert: Alert }
  | { type: "REMOVE_ALERT"; id: string }
  | { type: "CLEAR_ALERTS" };

interface ConfirmOptions {
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  glowColor?: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, "id">) => string;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  success: (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => string;
  error: (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => string;
  warning: (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => string;
  info: (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => string;
  cinematic: (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => string;
  confirm: (title: string, message: string, options?: ConfirmOptions) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

function alertReducer(state: Alert[], action: AlertAction): Alert[] {
  switch (action.type) {
    case "ADD_ALERT":
      return [...state, action.alert];
    case "REMOVE_ALERT":
      return state.filter(alert => alert.id !== action.id);
    case "CLEAR_ALERTS":
      return [];
    default:
      return state;
  }
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, dispatch] = useReducer(alertReducer, []);

  const addAlert = useCallback((alert: Omit<Alert, "id">): string => {
    const id = uuidv4();
    dispatch({
      type: "ADD_ALERT",
      alert: { ...alert, id },
    });
    return id;
  }, []);

  const removeAlert = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ALERT", id });
  }, []);

  const clearAlerts = useCallback(() => {
    dispatch({ type: "CLEAR_ALERTS" });
  }, []);

  const createAlertFunction = useCallback((type: AlertType) => 
    (title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message">>) => {
      return addAlert({
        type,
        title,
        message,
        ...options,
      });
    },
    [addAlert]
  );

  const confirm = useCallback((title: string, message: string, options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      addAlert({
        type: "confirm",
        title,
        message,
        primaryActionLabel: options?.primaryActionLabel || "Confirm",
        secondaryActionLabel: options?.secondaryActionLabel || "Cancel",
        glowColor: options?.glowColor,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, [addAlert]);

  const value: AlertContextType = {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    success: createAlertFunction("success"),
    error: createAlertFunction("error"),
    warning: createAlertFunction("warning"),
    info: createAlertFunction("info"),
    cinematic: createAlertFunction("cinematic"),
    confirm,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {/* Render all alerts */}
      {alerts.map((alert) => (
        <CustomAlert
          key={alert.id}
          {...alert}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}