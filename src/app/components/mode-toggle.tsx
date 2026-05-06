import * as React from "react"
import { Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button 
      type="button" 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 bg-transparent text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)] transition-all"
      style={{ borderRadius: "var(--radius)" }}
    >
      {/* Moon Icon (Visible in Light Mode, Hidden in Dark Mode) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0"
      >
        <path
          d="M10 1C8.80653 2.19347 8.13604 3.81217 8.13604 5.5C8.13604 7.18783 8.80653 8.80653 10 10C11.1935 11.1935 12.8122 11.864 14.5 11.864C16.1878 11.864 17.8065 11.1935 19 10C19 11.78 18.4722 13.5201 17.4832 15.0001C16.4943 16.4802 15.0887 17.6337 13.4442 18.3149C11.7996 18.9961 9.99002 19.1743 8.24419 18.8271C6.49836 18.4798 4.89472 17.6226 3.63604 16.364C2.37737 15.1053 1.5202 13.5016 1.17294 11.7558C0.82567 10.01 1.0039 8.20038 1.68509 6.55585C2.36628 4.91131 3.51983 3.50571 4.99987 2.51677C6.47991 1.52784 8.21997 1 10 1Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Sun Icon (Hidden in Light Mode, Visible in Dark Mode) */}
      <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}