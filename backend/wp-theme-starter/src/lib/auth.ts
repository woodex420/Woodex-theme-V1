// Auth store for the admin dashboard
// Manages user sessions, credentials, and role-based access

export type AdminUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "admin" | "editor" | "viewer";
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
};

export type LoginSession = {
  user: AdminUser;
  token: string;
  expiresAt: number;
};

const SESSION_KEY = "wp-admin-session";
const USERS_KEY = "wp-admin-users";
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

// Demo password storage. In production this would be hashed + backend-validated.
// For demo purposes we use a deterministic hash so anyone running the app
// can log in with the same credentials.
const DEFAULT_USERS: (AdminUser & { passwordHash: string })[] = [
  {
    id: "u-1",
    username: "admin",
    email: "admin@wpinterior.com",
    fullName: "Elena Marchetti",
    role: "admin",
    createdAt: "2025-01-01",
    passwordHash: "demo:wpinterior2024",
  },
  {
    id: "u-2",
    username: "editor",
    email: "editor@wpinterior.com",
    fullName: "Hassan Raza",
    role: "editor",
    createdAt: "2025-01-15",
    passwordHash: "demo:editor2025",
  },
  {
    id: "u-3",
    username: "demo",
    email: "demo@wpinterior.com",
    fullName: "Demo User",
    role: "viewer",
    createdAt: "2025-02-01",
    passwordHash: "demo:demo123",
  },
];

function getUsers(): (AdminUser & { passwordHash: string })[] {
  try {
    if (typeof localStorage === "undefined") return DEFAULT_USERS;
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      try {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      } catch {
        // ignore
      }
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_USERS;
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveUsers(users: (AdminUser & { passwordHash: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentSession(): LoginSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: LoginSession = JSON.parse(raw);
    if (session.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function createSession(user: AdminUser): LoginSession {
  const session: LoginSession = {
    user,
    token: btoa(`${user.id}-${Date.now()}-${Math.random()}`).slice(0, 40),
    expiresAt: Date.now() + SESSION_DURATION,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Update last login
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].lastLogin = new Date().toISOString();
    saveUsers(users);
  }
  return session;
}

export function login(username: string, password: string): { ok: boolean; error?: string; session?: LoginSession } {
  const users = getUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return { ok: false, error: "User not found" };
  // Demo validation: "demo:" prefix + raw password
  const expectedHash = `demo:${password}`;
  if (user.passwordHash !== expectedHash) {
    return { ok: false, error: "Incorrect password" };
  }
  const session = createSession({
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
  });
  return { ok: true, session };
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getAllUsers(): AdminUser[] {
  return getUsers().map(({ passwordHash: _ph, ...user }) => user);
}

export function updateUser(id: string, patch: Partial<AdminUser & { password?: string }>): { ok: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { ok: false, error: "User not found" };
  if (patch.password) {
    users[idx].passwordHash = `demo:${patch.password}`;
    delete (patch as Record<string, unknown>).password;
  }
  users[idx] = { ...users[idx], ...patch };
  saveUsers(users);
  return { ok: true };
}

export function createUser(input: AdminUser & { password: string }): { ok: boolean; error?: string; user?: AdminUser } {
  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) {
    return { ok: false, error: "Username already exists" };
  }
  const user: AdminUser & { passwordHash: string } = {
    id: `u-${Date.now()}`,
    username: input.username,
    email: input.email,
    fullName: input.fullName,
    role: input.role,
    avatar: input.avatar,
    createdAt: new Date().toISOString(),
    passwordHash: `demo:${input.password}`,
  };
  users.push(user);
  saveUsers(users);
  const { passwordHash: _ph, ...rest } = user;
  return { ok: true, user: rest };
}

export function deleteUser(id: string): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.length <= 1) return { ok: false, error: "Cannot delete last user" };
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { ok: false, error: "User not found" };
  users.splice(idx, 1);
  saveUsers(users);
  return { ok: true };
}

export function changeOwnPassword(currentPassword: string, newPassword: string): { ok: boolean; error?: string } {
  const session = getCurrentSession();
  if (!session) return { ok: false, error: "Not logged in" };
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === session.user.id);
  if (idx < 0) return { ok: false, error: "User not found" };
  if (users[idx].passwordHash !== `demo:${currentPassword}`) {
    return { ok: false, error: "Current password is incorrect" };
  }
  if (newPassword.length < 6) {
    return { ok: false, error: "New password must be at least 6 characters" };
  }
  users[idx].passwordHash = `demo:${newPassword}`;
  saveUsers(users);
  return { ok: true };
}
