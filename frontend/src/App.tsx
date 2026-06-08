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
