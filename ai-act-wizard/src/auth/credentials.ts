// src/auth/credentials.ts
export type UserRecord = {
  username: string
  password: string
  displayName: string
}

const USERS_KEY = "nova_users";
const CURRENT_KEY = "nova_current_user";

function readUsers(): UserRecord[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function writeUsers(users: UserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function ensureSeed(): void {
  let users = readUsers();

  // Kunde1 immer sicherstellen/aktualisieren
  const base = { username: "kunde1", password: "passwort1", displayName: "Yusuf" };
  if (!users.some(u => u.username === "kunde1")) {
    users.push(base);
  } else {
    users = users.map(u => u.username === "kunde1" ? base : u);
  }

  writeUsers(users);
}

export function generateCredentials(prefix = "kunde"): UserRecord {
  const num = Math.floor(1000 + Math.random() * 9000);
  const username = `${prefix}${num}`;
  const password = Math.random().toString(36).slice(2, 10);
  const displayName = username;
  return { username, password, displayName };
}

export function addUser(u: UserRecord): void {
  const users = readUsers();
  if (users.some(x => x.username === u.username)) throw new Error("Username existiert bereits.");
  users.push(u);
  writeUsers(users);
}

export function verifyLogin(username: string, password: string): UserRecord | null {
  const u = readUsers().find(u => u.username === username && u.password === password);
  return u || null;
}

export function setCurrentUser(u: UserRecord | null) {
  if (u) localStorage.setItem(CURRENT_KEY, JSON.stringify(u));
  else localStorage.removeItem(CURRENT_KEY);
}
export function getCurrentUser(): UserRecord | null {
  try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || "null"); }
  catch { return null; }
}
export function logout() { setCurrentUser(null); }

// optional für Debug
export function listUsers(): UserRecord[] { return readUsers(); }
