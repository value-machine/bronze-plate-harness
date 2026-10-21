import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QueryErrorBoundary } from "./QueryErrorBoundary";

function Thrower(): never {
  throw new Error("render failed");
}

describe("QueryErrorBoundary", () => {
  it("should forward the error and component stack to onError when a child throws", () => {
    const onError = vi.fn();
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    render(
      <QueryErrorBoundary onError={onError}>
        <Thrower />
      </QueryErrorBoundary>
    );
    expect(screen.getByText("Something went wrong. Please try again.")).toBeInTheDocument();
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: "render failed" }),
      expect.objectContaining({ componentStack: expect.stringContaining("Thrower") })
    );
    consoleSpy.mockRestore();
  });
});
