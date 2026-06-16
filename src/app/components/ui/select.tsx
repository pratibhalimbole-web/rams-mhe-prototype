"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ style, children, ...props }, ref) => {
  // Filter out Figma Make inspector props
  const { _fgT, _fgt, _fgS, _fgs, _fgB, _fgb, ...cleanProps } = props as any;
  
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      data-slot="select-trigger"
      style={{
        fontFamily: "Inter, sans-serif",
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-2)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        backgroundColor: "var(--input-background)",
        padding: "var(--spacing-2) var(--spacing-3)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-normal)",
        color: "var(--foreground)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        outline: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...cleanProps}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon 
          className="text-current"
          size={16}
          style={{ 
            opacity: 0.5,
            flexShrink: 0,
          }} 
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

function SelectContent({
  style,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-radix-portal="true"
        style={{
          fontFamily: "Inter, sans-serif",
          zIndex: 100000, // ✅ CRITICAL FIX: Increased to ensure dropdown appears above modal overlay (z-50)
          minWidth: "8rem",
          maxHeight: "var(--radix-select-content-available-height)",
          overflowX: "hidden",
          overflowY: "auto",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          backgroundColor: "var(--popover)",
          color: "var(--popover-foreground)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          pointerEvents: "auto",
          ...style,
        }}
        position={position}
        sideOffset={4}
        collisionPadding={8}
        avoidCollisions={true}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          style={{
            padding: "var(--spacing-1)",
            minWidth: position === "popper" ? "var(--radix-select-trigger-width)" : undefined,
          }}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      style={{
        fontFamily: "Inter, sans-serif",
        padding: "var(--spacing-2)",
        fontSize: "var(--text-xs)",
        fontWeight: "var(--font-weight-medium)",
        color: "var(--muted-foreground)",
        ...style,
      }}
      {...props}
    />
  );
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ style, children, ...props }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <SelectPrimitive.Item
      ref={ref}
      data-slot="select-item"
      style={{
        fontFamily: "Inter, sans-serif",
        position: "relative",
        display: "flex",
        width: "100%",
        cursor: "pointer",
        alignItems: "center",
        gap: "var(--spacing-2)",
        borderRadius: "var(--radius-sm)",
        padding: "6px var(--spacing-2)",
        paddingRight: "var(--spacing-8)",
        fontSize: "10px",
        fontWeight: "var(--font-weight-normal)",
        outline: "none",
        userSelect: "none",
        backgroundColor: isHovered ? "var(--accent)" : "transparent",
        color: isHovered ? "var(--accent-foreground)" : "var(--popover-foreground)",
        transition: "background-color 0.15s, color 0.15s",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span 
        style={{ 
          position: "absolute", 
          right: "var(--spacing-2)", 
          display: "flex", 
          width: "16px", 
          height: "16px", 
          alignItems: "center", 
          justifyContent: "center" 
        }}
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon size={16} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = SelectPrimitive.Item.displayName;

function SelectSeparator({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      style={{
        backgroundColor: "var(--border)",
        height: "1px",
        margin: "var(--spacing-1) 0",
        ...style,
      }}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      style={{
        display: "flex",
        cursor: "default",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-1) 0",
        ...style,
      }}
      {...props}
    >
      <ChevronUpIcon size={16} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  style,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      style={{
        display: "flex",
        cursor: "default",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-1) 0",
        ...style,
      }}
      {...props}
    >
      <ChevronDownIcon size={16} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};