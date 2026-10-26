import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HarnessOverviewCard } from "./HarnessOverviewCard";

describe("HarnessOverviewCard", () => {
  it("should link to the static harness overview page when rendered", () => {
    render(<HarnessOverviewCard />);

    expect(screen.getByRole("link", { name: /how the harness works/i })).toHaveAttribute(
      "href",
      "/harness.html"
    );
  });

  it("should show the overview preview image with alt text when rendered", () => {
    render(<HarnessOverviewCard />);

    expect(screen.getByRole("img", { name: /harness/i })).toHaveAttribute(
      "src",
      "/harness-overview.png"
    );
  });
});
