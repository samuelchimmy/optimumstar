
// Re-export toast functionality from our hooks version for consistency
import { useToast, toast } from "@/hooks/use-toast";
import { type ToasterToast } from "@/hooks/use-toast";

export { useToast, toast, type ToasterToast };

// Re-export the original toast component types
export type { ToastProps, ToastActionElement } from "@/components/ui/toast";
