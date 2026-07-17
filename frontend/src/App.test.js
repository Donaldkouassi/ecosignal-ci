import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn((url) => {
    const payload = url.includes("/conseils")
      ? []
      : { total_signalements: 0, en_attente: 0, en_cours: 0, resolus: 0, par_commune: [] };

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

test("affiche la page d'accueil EcoSignal CI", async () => {
  render(<App />);

  expect(screen.getByRole("heading", { name: /un quartier propre commence/i })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: /impact ecosignal ci/i })).toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
});

test("redirige un visiteur vers la connexion pour signaler", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /faire un signalement/i }));

  expect(await screen.findByRole("heading", { name: /connexion/i })).toBeInTheDocument();
});

test("permet d'afficher puis de masquer le mot de passe", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /connexion/i }));

  const password = screen.getByLabelText(/^mot de passe$/i, { selector: "input" });
  expect(password).toHaveAttribute("type", "password");
  fireEvent.click(screen.getByRole("button", { name: /afficher le mot de passe/i }));
  expect(password).toHaveAttribute("type", "text");
  fireEvent.click(screen.getByRole("button", { name: /masquer le mot de passe/i }));
  expect(password).toHaveAttribute("type", "password");
});
