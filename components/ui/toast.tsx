"use client";

import { CircleCheck, CircleAlert, Info, X } from "lucide-react";
import {
  Button,
  Text,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from "react-aria-components";

export type ToastVariant = "success" | "error" | "info";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  /** Auto-dismiss delay in milliseconds. Use 0 to keep the toast open. */
  duration?: number;
};

type ToastContentValue = Omit<ToastOptions, "duration" | "variant"> & {
  variant: ToastVariant;
};

const queue = new ToastQueue<ToastContentValue>({ maxVisibleToasts: 3 });

const variants = {
  success: { icon: CircleCheck, className: "text-primary" },
  error: { icon: CircleAlert, className: "text-error" },
  info: { icon: Info, className: "text-secondary" },
};

/** Show a toast from a client event handler. Returns its dismissal key. */
export function toast({
  title,
  description,
  variant = "info",
  duration = 5000,
}: ToastOptions) {
  return queue.add(
    { title, description, variant },
    { timeout: duration > 0 ? Math.max(5000, duration) : undefined },
  );
}

export function dismissToast(key: string) {
  queue.close(key);
}

/** Mount once in the root layout. */
export function Toaster() {
  return (
    <ToastRegion
      queue={queue}
      aria-label="Notifications"
      className="fixed right-4 bottom-4 left-4 z-50 flex flex-col gap-3 outline-none sm:left-auto sm:w-96"
    >
      {({ toast: notification }) => {
        const { icon: Icon, className } = variants[notification.content.variant];

        return (
          <AriaToast
            toast={notification}
            className="flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-on-surface shadow-lg outline-none data-focus-visible:ring-2 data-focus-visible:ring-primary"
          >
            <Icon aria-hidden="true" className={`mt-0.5 size-5 shrink-0 ${className}`} />
            <ToastContent className="min-w-0 flex-1 break-words">
              <Text slot="title" className="block font-label-md text-label-md">
                {notification.content.title}
              </Text>
              {notification.content.description && (
                <Text slot="description" className="mt-1 block text-sm text-on-surface-variant">
                  {notification.content.description}
                </Text>
              )}
            </ToastContent>
            <Button
              slot="close"
              aria-label="Dismiss notification"
              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant outline-none hover:bg-surface-container-high data-focus-visible:ring-2 data-focus-visible:ring-primary"
            >
              <X aria-hidden="true" className="size-4" />
            </Button>
          </AriaToast>
        );
      }}
    </ToastRegion>
  );
}
