import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "tests/test-utils";
import { COLOR_MODE_STORAGE_KEY } from "@/shared/theme/colorMode";
import { ColorModeToggle } from "./ColorModeToggle";

const isDarkClassSet = () => document.documentElement.classList.contains("dark");

describe("ColorModeToggle", () => {
  it("should start on System and name the next mode", () => {
    renderWithProviders(<ColorModeToggle />, { withRouter: false });

    expect(
      screen.getByRole("button", { name: "Theme: System (click for Light)" })
    ).toBeInTheDocument();
  });

  it("should cycle Light → Dark → System on clicks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorModeToggle />, { withRouter: false });
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toHaveAccessibleName("Theme: Light (click for Dark)");
    expect(isDarkClassSet()).toBe(false);

    await user.click(button);
    expect(button).toHaveAccessibleName("Theme: Dark (click for System)");
    expect(isDarkClassSet()).toBe(true);
    expect(window.localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe("dark");

    await user.click(button);
    expect(button).toHaveAccessibleName("Theme: System (click for Light)");
  });

  it("should show the hover text as a tooltip", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ColorModeToggle />, { withRouter: false });

    await user.hover(screen.getByRole("button"));

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Theme: System (click for Light)");
  });
});
