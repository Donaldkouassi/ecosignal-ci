const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const REQUEST_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("ecosignal_token");
  const isFormData = options.body instanceof FormData;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
      throw new ApiError(
        payload?.message || "Le serveur n’a pas pu traiter la demande.",
        response.status,
        payload?.errors || {}
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === "AbortError") {
      throw new ApiError("Le serveur met trop de temps à répondre. Veuillez réessayer.", 408);
    }
    throw new ApiError("Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez.", 0);
  } finally {
    window.clearTimeout(timeout);
  }
}

export function firstValidationError(error) {
  const messages = Object.values(error?.errors || {}).flat();
  return messages[0] || error?.message || "Une erreur est survenue.";
}
