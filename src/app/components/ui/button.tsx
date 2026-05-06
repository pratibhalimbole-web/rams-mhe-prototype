import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--spacing-2)] whitespace-nowrap rounded-[var(--radius-md)] text-[var(--text-sm)] font-[var(--font-weight-medium)] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:w-[var(--spacing-4)] [&_svg:not([class*='size-'])]:h-[var(--spacing-4)] shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-[var(--spacing-1)] hover:underline",
      },
      size: {
        default: "h-[36px] px-[var(--spacing-4)] py-[var(--spacing-2)] has-[>svg]:px-[var(--spacing-3)]",
        sm: "h-[32px] rounded-[var(--radius-sm)] gap-[6px] px-[var(--spacing-3)] has-[>svg]:px-[10px]",
        lg: "h-[40px] rounded-[var(--radius-lg)] px-[var(--spacing-6)] has-[>svg]:px-[var(--spacing-4)]",
        icon: "h-[36px] w-[36px] rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      type={type}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };