import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "tests/test-utils";

const auth = vi.hoisted(() => ({ value: { user: null as unknown, loading: false } }));
vi.mock("@/shared/context/AuthContext", () => ({ useAuthContext: () => auth.value }));

const { RequireAdmin } = await import("./RequireAdmin");

function renderAt(user: unknown) {
  auth.value = { user, loading: false };
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<p>home</p>} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <p>admin area</p>
          </RequireAdmin>
        }
      />
    </Routes>,
    { initialEntries: ["/admin"] }
  );
}

describe("RequireAdmin", () => {
  it("should render children when the user is an admin", () => {
    renderAt({ id: "1", email: "a@b.c", appRole: "admin" });
    expect(screen.getByText("admin area")).toBeInTheDocument();
  });

  it("should redirect home when the user is not an admin", () => {
    renderAt({ id: "1", email: "a@b.c" });
    expect(screen.getByText("home")).toBeInTheDocument();
  });

  it("should redirect home when signed out", () => {
    renderAt(null);
    expect(screen.getByText("home")).toBeInTheDocument();
  });
});
