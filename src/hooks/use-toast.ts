
// This file is currently missing but referenced by other components
// Let's create it with proper exports from shadcn/ui

import { useToast as useShadcnToast, toast as shadcnToast } from "@/components/ui/toast";

export const useToast = useShadcnToast;
export const toast = shadcnToast;

export type { ToastProps, ToastActionElement } from "@/components/ui/toast";
