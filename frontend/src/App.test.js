import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
  // JSDOM ne fournit pas matchMedia ; désactiver les animations dans ces tests.
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: jest.fn((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
    })),
  });
  global.fetch = jest.fn((url) => {
    const payload = url.includes("/conseils") || url.includes("/carte")
      ? []
      : { total_signalements: 0, en_attente: 0, en_cours: 0, resolus: 0, par_commune: [], taux_resolution: 0 };

    return Promise.resolve({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(payload),
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function renderLoadedApp() {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByRole("region", { name: /le service en chiffres/i })).toHaveTextContent("0 %");
  });
}

test("affiche la page d'accueil EcoSignal CI", async () => {
  await renderLoadedApp();

  expect(screen.getByRole("heading", { name: /un dépôt sauvage dans votre rue/i })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: /le service en chiffres/i })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/carte"), expect.anything());
});

test("redirige un visiteur vers la connexion pour signaler", async () => {
  await renderLoadedApp();
  fireEvent.click(screen.getAllByRole("button", { name: /signaler un dépôt/i })[0]);

  expect(await screen.findByRole("heading", { name: /connexion/i })).toBeInTheDocument();
});

test("permet d'afficher puis de masquer le mot de passe", async () => {
  await renderLoadedApp();
  fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

  const password = screen.getByLabelText(/^mot de passe$/i, { selector: "input" });
  expect(password).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: /afficher le mot de passe/i }));
  expect(password).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: /masquer le mot de passe/i }));
  expect(password).toHaveAttribute("type", "password");
});
