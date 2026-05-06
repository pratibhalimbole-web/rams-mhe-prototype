"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

function Tabs({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      style={{
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-2)",
        ...style,
      }}
      {...props}
    />
  );
}

function TabsList({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "var(--muted)",
        color: "var(--muted-foreground)",
        display: "inline-flex",
        height: "36px",
        width: "fit-content",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius)",
        padding: "3px",
        ...style,
      }}
      {...props}
    />
  );
}

function TabsTrigger({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      style={{
        fontFamily: "Inter, sans-serif",
        display: "inline-flex",
        height: "calc(100% - 2px)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--spacing-1-5)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid transparent",
        paddingLeft: "var(--spacing-2)",
        paddingRight: "var(--spacing-2)",
        paddingTop: "var(--spacing-1)",
        paddingBottom: "var(--spacing-1)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-medium)",
        whiteSpace: "nowrap",
        transition: "color 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s",
        outline: "none",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    />
  );
}

function TabsContent({
  style,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      style={{
        fontFamily: "Inter, sans-serif",
        flex: 1,
        outline: "none",
        ...style,
      }}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
