import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { BackendAuthUser } from '../services/auth';

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
      schoolName: 'Sekolah',
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
      schoolName: 'Sekolah',
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
      schoolName: 'Sekolah',
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

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (id: string, pass: string) => boolean;
  loginWithBackendUser: (
    backendUser: BackendAuthUser,
    extras?: { name?: string; className?: string },
  ) => void;
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

  const loginWithBackendUser = useCallback(
    (backendUser: BackendAuthUser, extras?: { name?: string; className?: string }) => {
      setUser({
        email: backendUser.email,
        name: extras?.name?.trim() || backendUser.username,
        username: backendUser.username,
        role: backendUser.role === 'admin' ? 'school_admin' : 'student',
        schoolName: 'Sekolah',
        className: extras?.className ?? 'Kelas 11 IPA',
        sourceMode: 'COMPANY_PLUS_SCHOOL',
        bio: backendUser.bio ?? '',
      });
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
    () => ({ user, isLoading, login, loginWithBackendUser, logout, updateUser }),
    [user, isLoading, login, loginWithBackendUser, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
