"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ style, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    style={{
      fontFamily: "Inter, sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "var(--spacing-2)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-normal)",
      lineHeight: 1.43,
      userSelect: "none",
      ...style,
    }}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
