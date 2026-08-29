'use client';

import * as React from 'react';

// ==========================================
// 1. AUTH STATE STORE
// ==========================================
export interface UserProfile {
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthState | undefined>(undefined);

export function useAuthStore() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuthStore must be used within GlobalStoreProvider');
  return context;
}

// ==========================================
// 2. NOTIFICATIONS STORE
// ==========================================
export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
}

export interface NotificationsState {
  notifications: SystemNotification[];
  addNotification: (notif: Omit<SystemNotification, 'id' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = React.createContext<NotificationsState | undefined>(undefined);

export function useNotificationsStore() {
  const context = React.useContext(NotificationsContext);
  if (!context) throw new Error('useNotificationsStore must be used within GlobalStoreProvider');
  return context;
}

// ==========================================
// 3. SIDEBAR STORE
// ==========================================
export interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarState | undefined>(undefined);

export function useSidebarStore() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error('useSidebarStore must be used within GlobalStoreProvider');
  return context;
}

// ==========================================
// 4. PREFERENCES STORE
// ==========================================
export interface PreferencesState {
  compactMode: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  setCompactMode: (compact: boolean) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
}

const PreferencesContext = React.createContext<PreferencesState | undefined>(undefined);

export function usePreferencesStore() {
  const context = React.useContext(PreferencesContext);
  if (!context) throw new Error('usePreferencesStore must be used within GlobalStoreProvider');
  return context;
}

// ==========================================
// COMBINED GLOBAL STORE PROVIDER
// ==========================================
export const GlobalStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [auth, setAuth] = React.useState<Pick<AuthState, 'isAuthenticated' | 'user' | 'token'>>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  // Load auth state from localStorage on init
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('eduverse-token');
      const storedUser = localStorage.getItem('eduverse-user');
      if (storedToken && storedUser) {
        try {
          setAuth({
            isAuthenticated: true,
            token: storedToken,
            user: JSON.parse(storedUser),
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const login = (user: UserProfile, token: string) => {
    localStorage.setItem('eduverse-token', token);
    localStorage.setItem('eduverse-user', JSON.stringify(user));
    setAuth({ isAuthenticated: true, user, token });
  };

  const logout = () => {
    localStorage.removeItem('eduverse-token');
    localStorage.removeItem('eduverse-user');
    setAuth({ isAuthenticated: false, user: null, token: null });
  };

  // Notifications state
  const [notifications, setNotifications] = React.useState<SystemNotification[]>([
    { id: '1', title: 'Welcome to EduVerse', description: 'Your portal account is successfully established.', type: 'success', read: false },
  ]);

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'read'>) => {
    const newNotif = { ...notif, id: Math.random().toString(), read: false };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => setNotifications([]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Preferences state
  const [compactMode, setCompactMode] = React.useState(false);
  const [fontSize, setFontSize] = React.useState<'sm' | 'md' | 'lg'>('md');

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      <NotificationsContext.Provider value={{ notifications, addNotification, markAsRead, clearAll }}>
        <SidebarContext.Provider value={{ isOpen: sidebarOpen, toggle: toggleSidebar, setOpen: setSidebarOpen }}>
          <PreferencesContext.Provider value={{ compactMode, fontSize, setCompactMode, setFontSize }}>
            {children}
          </PreferencesContext.Provider>
        </SidebarContext.Provider>
      </NotificationsContext.Provider>
    </AuthContext.Provider>
  );
};
export default GlobalStoreProvider;
