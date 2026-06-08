import { useEffect, useState, useCallback } from 'react';
import { api, AUTH_TOKEN_KEY, getApiErrorMessage } from './api/api';
import './App.css';
import Toast from './components/Toast';
import AuthView from './components/AuthView';
import NotesModule from './components/modules/NotesModule';
import RemindersModule from './components/modules/RemindersModule';
import HabitsModule from './components/modules/HabitsModule';
import FinancesModule from './components/modules/FinancesModule';
import CalendarModule from './components/modules/CalendarModule';
import Dashboard from './components/modules/Dashboard';

export type View = 'dashboard' | 'notes' | 'calendar' | 'reminders' | 'habits' | 'finances';
export type ToastItem = { id: number; message: string; type?: 'success' | 'error' };
type AuthUser = { id: number; name: string; email: string };
type NotificationState = NotificationPermission | 'unsupported';

const NOTIFIED_REMINDERS_KEY = 'lm:notifiedReminders';

function App() {
  const [active, setActive] = useState<View>('dashboard');
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategories, setNoteCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [finSummary, setFinSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [finCategories, setFinCategories] = useState<any[]>([]);
  const [currency, setCurrency] = useState<'COP' | 'USD'>(() => (localStorage.getItem('lm:currency') as 'COP' | 'USD') || 'COP');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [notificationState, setNotificationState] = useState<NotificationState>(() => (
    'Notification' in window ? Notification.permission : 'unsupported'
  ));
  const [now, setNow] = useState(() => Date.now());

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((s) => [...s, { id, message, type }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 4000);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [nRes, cRes, eRes, rRes, hRes, sRes, tRes, fcRes] = await Promise.all([
        api.get('/notes'),
        api.get('/note-categories'),
        api.get('/calendar-events'),
        api.get('/reminders'),
        api.get('/habits'),
        api.get('/finances/summary'),
        api.get('/finances/transactions'),
        api.get('/finances/categories'),
      ]);
      setNotes(nRes.data ?? []);
      setNoteCategories(cRes.data ?? []);
      setEvents(eRes.data ?? []);
      setReminders(rRes.data ?? []);
      setHabits(hRes.data ?? []);
      setFinSummary(sRes.data ?? null);
      setTransactions(tRes.data ?? []);
      setFinCategories(fcRes.data ?? []);
    } catch (err) {
      console.error('Error loading data', err);
      showToast(getApiErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api.get<AuthUser>('/auth/me')
      .then(({ data }) => {
        setAuthUser(data);
        return loadAll();
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthUser(null);
        setLoading(false);
      });
  }, [loadAll]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    const dueReminders = reminders.filter((reminder) => {
      const status = reminder.status || 'PENDING';
      return status === 'PENDING' && new Date(reminder.remindAt).getTime() <= now;
    });

    if (dueReminders.length === 0) {
      return;
    }

    const notified = new Set(JSON.parse(localStorage.getItem(NOTIFIED_REMINDERS_KEY) || '[]') as string[]);

    dueReminders.forEach((reminder) => {
      const notificationKey = `${reminder.id}:${reminder.remindAt}`;

      if (notified.has(notificationKey)) {
        return;
      }

      showToast(`Recordatorio vencido: ${reminder.title}`, 'error');

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Recordatorio pendiente', {
          body: reminder.description || reminder.title,
          tag: `lifemanager-reminder-${reminder.id}`,
        });
      }

      notified.add(notificationKey);
    });

    localStorage.setItem(NOTIFIED_REMINDERS_KEY, JSON.stringify([...notified]));
  }, [authUser, reminders, now, showToast]);

  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAuthUser(null);
    setNotes([]);
    setNoteCategories([]);
    setEvents([]);
    setReminders([]);
    setHabits([]);
    setFinSummary(null);
    setTransactions([]);
    setFinCategories([]);
  }

  async function requestNotifications() {
    if (!('Notification' in window)) {
      setNotificationState('unsupported');
      showToast('Tu navegador no soporta notificaciones', 'error');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationState(permission);

    if (permission === 'granted') {
      showToast('Notificaciones activadas', 'success');
    } else {
      showToast('No se activaron las notificaciones', 'error');
    }
  }

  function formatAmount(amount: any) {
    const val = typeof amount === 'string' ? Number(amount) : amount;
    if (Number.isNaN(val)) return String(amount);
    const locale = currency === 'COP' ? 'es-CO' : 'en-US';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
  }

  const navItems: { id: View; label: string; icon: string; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'notes', label: 'Notas', icon: '✎', count: notes.length },
    { id: 'calendar', label: 'Calendario', icon: '▦', count: events.length },
    { id: 'reminders', label: 'Recordatorios', icon: '◉', count: reminders.length },
    { id: 'habits', label: 'Hábitos', icon: '◎', count: habits.length },
    { id: 'finances', label: 'Finanzas', icon: '◈' },
  ];
  const dueReminders = reminders.filter((reminder) => {
    const status = reminder.status || 'PENDING';
    return status === 'PENDING' && new Date(reminder.remindAt).getTime() <= now;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">✦</div>
        <span>Cargando LifeManager…</span>
      </div>
    );
  }

  if (!authUser) {
    return <AuthView onAuth={(user) => { setAuthUser(user); loadAll(); }} />;
  }

  return (
    <div className="layout">
      <Toast toasts={toasts} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-icon">✦</span>
          <strong>LifeManager</strong>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => { setActive(item.id); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="nav-badge">{item.count}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-mini">
            <strong>{authUser.name}</strong>
            <span>{authUser.email}</span>
          </div>
          <label className="currency-toggle">
            <span>Moneda</span>
            <select value={currency} onChange={(e) => { const v = e.target.value as 'COP' | 'USD'; setCurrency(v); localStorage.setItem('lm:currency', v); }}>
              <option value="COP">COP $</option>
              <option value="USD">USD $</option>
            </select>
          </label>
          <div className="notification-control">
            <span>Notificaciones</span>
            {notificationState === 'granted' ? (
              <strong>Activas</strong>
            ) : (
              <button onClick={requestNotifications} disabled={notificationState === 'unsupported'}>
                Activar
              </button>
            )}
          </div>
          <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="topbar-title">{navItems.find(n => n.id === active)?.label}</span>
          <span className="brand-icon-sm">✦</span>
        </header>
        <main className="content">
          {dueReminders.length > 0 && (
            <div className="notification-banner">
              <div>
                <strong>{dueReminders.length} recordatorio{dueReminders.length === 1 ? '' : 's'} pendiente{dueReminders.length === 1 ? '' : 's'}</strong>
                <span>Hay recordatorios vencidos esperando tu atención.</span>
              </div>
              <button onClick={() => setActive('reminders')}>Ver</button>
            </div>
          )}
          {active === 'dashboard' && <Dashboard notes={notes} reminders={reminders} habits={habits} transactions={transactions} finSummary={finSummary} formatAmount={formatAmount} setActive={setActive} />}
          {active === 'notes' && <NotesModule notes={notes} noteCategories={noteCategories} reload={loadAll} showToast={showToast} />}
          {active === 'calendar' && <CalendarModule events={events} reload={loadAll} showToast={showToast} />}
          {active === 'reminders' && <RemindersModule reminders={reminders} reload={loadAll} showToast={showToast} />}
          {active === 'habits' && <HabitsModule habits={habits} reload={loadAll} showToast={showToast} />}
          {active === 'finances' && <FinancesModule transactions={transactions} finCategories={finCategories} finSummary={finSummary} formatAmount={formatAmount} reload={loadAll} showToast={showToast} />}
        </main>
      </div>
    </div>
  );
}

export default App;
