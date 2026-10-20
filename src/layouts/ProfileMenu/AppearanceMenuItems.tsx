import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/common/DropdownMenu";
import { useColorMode } from "@/shared/context/ColorModeContext";
import { isColorMode, type ColorMode } from "@/shared/theme/colorMode";

const OPTIONS: { mode: ColorMode; label: string; icon: LucideIcon }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "System", icon: Monitor },
];

/** Light / Dark / System choice; keeps the menu open so modes can be compared. */
export const AppearanceMenuItems = () => {
  const { mode, setMode } = useColorMode();

  return (
    <>
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuRadioGroup
        value={mode}
        onValueChange={(next) => isColorMode(next) && setMode(next)}
      >
        {OPTIONS.map(({ mode: option, label, icon: Icon }) => (
          <DropdownMenuRadioItem
            key={option}
            value={option}
            onSelect={(event) => event.preventDefault()}
          >
            <Icon />
            {label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );
};
