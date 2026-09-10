import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomePage } from "@/pages/home/HomePage";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { renderWithProviders } from "@/test/helpers/renderWithProviders";

function renderHome() {
  return renderWithProviders(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <HomePage />
    </ThemeProvider>,
  );
}

describe("HomePage", () => {
  it("renders header and promo list", () => {
    renderHome();

    expect(screen.getByText("Birthday Promos")).toBeInTheDocument();
    expect(screen.getByText("Vikings Luxury Buffet")).toBeInTheDocument();
    expect(screen.getByText(/\d+ promos/)).toBeInTheDocument();
  });

  it("filters promos by category", () => {
    renderHome();

    fireEvent.click(screen.getByRole("tab", { name: /Beauty/i }));

    expect(screen.queryByText("Vikings Luxury Buffet")).not.toBeInTheDocument();
    expect(screen.getByText(/\d+ promo/)).toBeInTheDocument();
  });

  it("opens detail dialog when a list item is clicked", async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(
      screen.getByRole("button", { name: /Vikings Luxury Buffet/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Vikings Luxury Buffet",
    });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByRole("heading", { name: "What you'll get" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getAllByText("Free luxury buffet for celebrant").length,
    ).toBeGreaterThan(0);
  });
});
