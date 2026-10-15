import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'student' | 'teacher' | 'school_admin';

export interface AuthUser {
  email: string;
  name: string;
  username: string;
  role: UserRole;
  schoolName: string;
  className: string;
  sourceMode: string;
  bio: string;
}

interface DemoAccount {
  email: string;
  pass: string;
  user: Omit<AuthUser, 'bio'> & { bio: string };
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'budi@student.sch.id',
    pass: 'siswa123',
    user: {
      email: 'budi@student.sch.id',
      name: 'Budi Santoso',
      username: 'budisantoso',
      role: 'student',
      schoolName: 'SMA Negeri 1 Jakarta',
      className: 'Kelas 11 IPA 2',
      sourceMode: 'COMPANY_PLUS_SCHOOL',
      bio: 'Siswa kelas 11 yang antusias dengan Fisika dan Pemrograman.',
    },
  },
  {
    email: 'admin@school.sch.id',
    pass: 'admin123',
    user: {
      email: 'admin@school.sch.id',
      name: 'Dra. Siti Aminah',
      username: 'sitiaminah',
      role: 'school_admin',
      schoolName: 'SMA Negeri 1 Jakarta',
      className: 'Kelas Admin (Sekolah)',
      sourceMode: 'COMPANY_PLUS_SCHOOL',
      bio: 'Administrator sekolah resmi yang ditugaskan mengelola akun dan konfigurasi.',
    },
  },
  {
    email: 'guru@school.sch.id',
    pass: 'guru123',
    user: {
      email: 'guru@school.sch.id',
      name: 'Ahmad Fauzi, S.Pd',
      username: 'ahmadfauzi',
      role: 'teacher',
      schoolName: 'SMA Negeri 1 Jakarta',
      className: 'Kelas Guru Pengampu',
      sourceMode: 'COMPANY_PLUS_SCHOOL',
      bio: 'Guru pengampu mata pelajaran Fisika dan Matematika.',
    },
  },
];

const STORAGE_KEY = 'bekalin.auth.user';
const USERS_KEY = 'bekalin.auth.users';

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function loadStoredUsers(): Array<{ email: string; pass: string; user: AuthUser }> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Array<{ email: string; pass: string; user: AuthUser }>;
  } catch {
    return [];
  }
}

function saveStoredUsers(users: Array<{ email: string; pass: string; user: AuthUser }>) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (id: string, pass: string) => boolean;
  signup: (input: {
    name: string;
    email: string;
    pass: string;
    className: string;
  }) => { ok: boolean; error?: string };
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(loadStoredUser());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((id: string, pass: string): boolean => {
    const normalized = id.trim().toLowerCase();
    const demo = DEMO_ACCOUNTS.find(
      (a) =>
        (a.email.toLowerCase() === normalized || a.user.username.toLowerCase() === normalized) &&
        a.pass === pass,
    );
    if (demo) {
      setUser({ ...demo.user });
      return true;
    }
    const custom = loadStoredUsers().find(
      (a) =>
        (a.email.toLowerCase() === normalized || a.user.username.toLowerCase() === normalized) &&
        a.pass === pass,
    );
    if (custom) {
      setUser({ ...custom.user });
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(
    (input: { name: string; email: string; pass: string; className: string }) => {
      const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
      if (emojiRegex.test(input.pass)) {
        return { ok: false, error: 'Kata sandi tidak boleh mengandung emoji!' };
      }
      const newUser: AuthUser = {
        email: input.email,
        name: input.name,
        username: input.email.split('@')[0],
        role: 'student',
        schoolName: 'SMA Negeri Mitra',
        className: input.className,
        sourceMode: 'COMPANY_PLUS_SCHOOL',
        bio: 'Siswa baru terdaftar di Bekalin.',
      };
      const users = loadStoredUsers();
      users.push({ email: input.email, pass: input.pass, user: newUser });
      saveStoredUsers(users);
      setUser(newUser);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout, updateUser }),
    [user, isLoading, login, signup, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
