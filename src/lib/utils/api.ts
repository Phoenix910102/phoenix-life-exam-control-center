export function apiHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = localStorage.getItem("app_token");
  if (token) headers["x-app-token"] = token;
  return headers;
}
