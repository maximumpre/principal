export type LoginScene = "username" | "password";

export function validateUsername(username: string): string | null {
  if (!username.trim()) {
    return "This field cannot be left blank";
  }
  return null;
}
