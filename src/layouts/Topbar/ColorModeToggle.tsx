import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Tooltip } from "@/components/common/Tooltip";
import { useColorMode } from "@/shared/context/ColorModeContext";
import type { ColorMode } from "@/shared/theme/colorMode";

const MODE_UI: Record<ColorMode, { label: string; icon: LucideIcon; next: ColorMode }> = {
  light: { label: "Light", icon: Sun, next: "dark" },
  dark: { label: "Dark", icon: Moon, next: "system" },
  system: { label: "System", icon: Monitor, next: "light" },
};

/** One icon button that cycles Light → Dark → System; the hover text names both modes. */
export const ColorModeToggle = () => {
  const { mode, setMode } = useColorMode();
  const { label, icon: Icon, next } = MODE_UI[mode];
  const title = `Theme: ${label} (click for ${MODE_UI[next].label})`;

  return (
    <Tooltip title={title}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={title}
        onClick={() => setMode(next)}
        className="text-foreground hover:bg-accent"
      >
        <Icon className="size-5" />
      </Button>
    </Tooltip>
  );
};
