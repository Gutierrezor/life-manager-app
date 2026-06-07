import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, setApiToken } from './api/api';
import './App.css';
import { AuthForm } from './components/AuthForm';
import { EmptyState } from './components/EmptyState';
import { ListRow } from './components/ListRow';
import { PanelTitle } from './components/PanelTitle';
import { SectionHeader } from './components/SectionHeader';
import { StatCard } from './components/StatCard';

type Tab = 'reminders' | 'agenda' | 'expenses' | 'habits';

type Expense = {
  id: number;
  title: string;
  amount: string;
  category: string;
  description?: string;
};

type Income = {
  id: number;
  title: string;
  amount: string;
  source?: string;
  incomeDate: string;
};

type Reminder = {
  id: number;
  title: string;
  description?: string;
  remindAt: string;
  status: string;
  priority: string;
};

type AgendaEvent = {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
};

type Habit = {
  id: number;
  name: string;
  description?: string;
  status: string;
  streak: number;
  targetDays: number;
  lastTrackedAt?: string;
};

type AuthFormState = {
  email: string;
  password: string;
  fullName: string;
};

const storageKey = 'life_manager_token';

function getEmailFromToken(token: string) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded?.email ?? '';
  } catch {
    return '';
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(storageKey) ?? '');
  const [userEmail, setUserEmail] = useState(() => getEmailFromToken(localStorage.getItem(storageKey) ?? ''));
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState<AuthFormState>({
    email: '',
    password: '',
    fullName: '',
  });

  const [activeTab, setActiveTab] = useState<Tab>('agenda');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [agenda, setAgenda] = useState<AgendaEvent[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    description: '',
  });
  const [incomeForm, setIncomeForm] = useState({
    title: '',
    amount: '',
    source: '',
  });
  const [habitForm, setHabitForm] = useState({
    name: '',
    description: '',
    status: 'PENDING',
    targetDays: '7',
  });
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    remindAt: '',
    priority: 'MEDIUM',
  });
  const [agendaForm, setAgendaForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [financeType, setFinanceType] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    if (token) {
      setApiToken(token);
      setUserEmail(getEmailFromToken(token));
      loadData();
    } else {
      setApiToken(undefined);
    }
  }, [token]);

  async function handleApiError(error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as any).response;
      if (response?.status === 401) {
        handleLogout();
        setError('Sesión expirada. Inicia sesión nuevamente.');
        return;
      }
    }

    setError('Ocurrió un error al procesar la solicitud.');
  }

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [expensesRes, incomesRes, remindersRes, agendaRes, habitsRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/incomes'),
        api.get('/reminders'),
        api.get('/agenda'),
        api.get('/habits'),
      ]);

      setExpenses(expensesRes.data);
      setIncomes(incomesRes.data);
      setReminders(remindersRes.data);
      setAgenda(agendaRes.data);
      setHabits(habitsRes.data);
    } catch (error) {
      await handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: authForm.email,
        password: authForm.password,
      });
      const accessToken = response.data.accessToken;
      setToken(accessToken);
      localStorage.setItem(storageKey, accessToken);
      setUserEmail(getEmailFromToken(accessToken));
      setAuthForm({ email: '', password: '', fullName: '' });
    } catch (error) {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        email: authForm.email,
        password: authForm.password,
        fullName: authForm.fullName,
      });
      setAuthMode('login');
      setError('Usuario creado. Ahora inicia sesión.');
      setAuthForm({ email: '', password: '', fullName: '' });
    } catch (error) {
      setError('No se pudo registrar el usuario.');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setUserEmail('');
    localStorage.removeItem(storageKey);
    setExpenses([]);
    setIncomes([]);
    setReminders([]);
    setAgenda([]);
    setHabits([]);
  }

  async function handleExpenseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        description: expenseForm.description || undefined,
      };

      if (editingExpenseId) {
        await api.patch(`/expenses/${editingExpenseId}`, payload);
      } else {
        await api.post('/expenses', payload);
      }

      await loadData();
      setShowForm(false);
      setEditingExpenseId(null);
      setExpenseForm({ title: '', amount: '', category: 'FOOD', description: '' });
    } catch (error) {
      await handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleIncomeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title: incomeForm.title,
        amount: Number(incomeForm.amount),
        source: incomeForm.source || undefined,
      };

      if (editingIncomeId) {
        await api.patch(`/incomes/${editingIncomeId}`, payload);
      } else {
        await api.post('/incomes', payload);
      }

      await loadData();
      setShowForm(false);
      setEditingIncomeId(null);
      setIncomeForm({ title: '', amount: '', source: '' });
    } catch (error) {
      await handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHabitSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name: habitForm.name,
        description: habitForm.description || undefined,
        status: habitForm.status,
        targetDays: Number(habitForm.targetDays),
      };

      if (editingHabitId) {
        await api.patch(`/habits/${editingHabitId}`, payload);
      } else {
        await api.post('/habits', payload);
      }

      await loadData();
      setShowForm(false);
      setEditingHabitId(null);
      setHabitForm({ name: '', description: '', status: 'PENDING', targetDays: '7' });
    } catch (error) {
      await handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(endpoint: string, id: number) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete(`${endpoint}/${id}`);
      await loadData();
    } catch (error) {
      await handleApiError(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEditExpense(expense: Expense) {
    setFinanceType('expense');
    setEditingExpenseId(expense.id);
    setExpenseForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description || '',
    });
    setShowForm(true);
    setActiveTab('expenses');
  }

  function handleEditIncome(income: Income) {
    setFinanceType('income');
    setEditingIncomeId(income.id);
    setIncomeForm({
      title: income.title,
      amount: income.amount,
      source: income.source || '',
    });
    setShowForm(true);
    setActiveTab('expenses');
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabitId(habit.id);
    setHabitForm({
      name: habit.name,
      description: habit.description || '',
      status: habit.status,
      targetDays: String(habit.targetDays),
    });
    setShowForm(true);
    setActiveTab('habits');
  }

  const totalExpenses = expenses.reduce((total, item) => total + Number(item.amount), 0);
  const totalIncome = incomes.reduce((total, item) => total + Number(item.amount), 0);
  const balance = totalIncome - totalExpenses;
  const completedHabits = habits.filter((habit) => habit.status === 'DONE').length;
  const pendingHabits = habits.filter((habit) => habit.status !== 'DONE').length;

  if (!token) {
    return (
      <main className="app auth-screen">
        <AuthForm
          mode={authMode}
          email={authForm.email}
          password={authForm.password}
          fullName={authForm.fullName}
          error={error}
          loading={loading}
          onChange={(field, value) => setAuthForm({ ...authForm, [field]: value })}
          onSubmit={authMode === 'login' ? handleLogin : handleRegister}
          onToggleMode={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login');
            setError('');
          }}
        />
      </main>
    );
  }

  return (
    <main className="app">
      <header className="navbar">
        <div className="brand">
          <span>✦</span>
          <strong>MiHub</strong>
        </div>

        <nav className="nav-actions">
          <button
            className={activeTab === 'reminders' ? 'active' : ''}
            onClick={() => {
              setActiveTab('reminders');
              setShowForm(false);
            }}
          >
            🔔 Recordatorios
          </button>

          <button
            className={activeTab === 'agenda' ? 'active' : ''}
            onClick={() => {
              setActiveTab('agenda');
              setShowForm(false);
            }}
          >
            📅 Calendario
          </button>

          <button
            className={activeTab === 'expenses' ? 'active' : ''}
            onClick={() => {
              setActiveTab('expenses');
              setShowForm(false);
            }}
          >
            📊 Finanzas
          </button>

          <button
            className={activeTab === 'habits' ? 'active' : ''}
            onClick={() => {
              setActiveTab('habits');
              setShowForm(false);
            }}
          >
            🔥 Hábitos
          </button>
        </nav>

        <div className="user-actions">
          <span>{userEmail}</span>
          <button className="outline-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {error && <div className="toast-error">{error}</div>}

      {activeTab === 'agenda' && (
        <section>
          <SectionHeader
            title="Calendario"
            buttonText="+ Nuevo evento"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <form className="form-panel" onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError('');
              try {
                await api.post('/agenda', {
                  title: agendaForm.title,
                  description: agendaForm.description || undefined,
                  startTime: new Date(agendaForm.startTime).toISOString(),
                  endTime: new Date(agendaForm.endTime).toISOString(),
                  location: agendaForm.location || undefined,
                });
                setAgendaForm({ title: '', description: '', startTime: '', endTime: '', location: '' });
                setShowForm(false);
                await loadData();
              } catch (error) {
                await handleApiError(error);
              } finally {
                setLoading(false);
              }
            }}>
              <input
                placeholder="Título del evento"
                value={agendaForm.title}
                onChange={(e) => setAgendaForm({ ...agendaForm, title: e.target.value })}
              />
              <input
                placeholder="Descripción"
                value={agendaForm.description}
                onChange={(e) => setAgendaForm({ ...agendaForm, description: e.target.value })}
              />
              <input
                type="datetime-local"
                value={agendaForm.startTime}
                onChange={(e) => setAgendaForm({ ...agendaForm, startTime: e.target.value })}
              />
              <input
                type="datetime-local"
                value={agendaForm.endTime}
                onChange={(e) => setAgendaForm({ ...agendaForm, endTime: e.target.value })}
              />
              <input
                placeholder="Ubicación"
                value={agendaForm.location}
                onChange={(e) => setAgendaForm({ ...agendaForm, location: e.target.value })}
              />
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </form>
          )}

          <div className="calendar-layout">
            <article className="panel calendar-panel">
              <div className="calendar-header">
                <button disabled>‹</button>
                <h2>Mayo 2026</h2>
                <button disabled>›</button>
              </div>
              <div className="calendar-grid">
                {['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SÁ'].map((day) => (
                  <span className="day-name" key={day}>
                    {day}
                  </span>
                ))}
                {Array.from({ length: 35 }, (_, index) => {
                  const day = index - 4;
                  const isCurrent = day === 24;
                  return (
                    <span
                      key={index}
                      className={isCurrent ? 'calendar-day selected' : 'calendar-day'}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                    </span>
                  );
                })}
              </div>
            </article>

            <article className="panel events-panel">
              <PanelTitle icon="📅" title="Próximos eventos" />
              {agenda.length === 0 ? (
                <EmptyState text="Sin eventos próximos" />
              ) : (
                agenda.map((event) => (
                  <ListRow
                    key={event.id}
                    title={event.title}
                    subtitle={`${formatDate(event.startTime)} · ${event.location ?? 'Sin ubicación'}`}
                  />
                ))
              )}
            </article>
          </div>
        </section>
      )}

      {activeTab === 'expenses' && (
        <section>
          <SectionHeader
            title="Finanzas"
            buttonText="+ Nueva transacción"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <div className="record-type-switch">
              <button
                type="button"
                className={financeType === 'expense' ? 'active' : ''}
                onClick={() => {
                  setFinanceType('expense');
                  setEditingIncomeId(null);
                }}
              >
                Gasto
              </button>
              <button
                type="button"
                className={financeType === 'income' ? 'active' : ''}
                onClick={() => {
                  setFinanceType('income');
                  setEditingExpenseId(null);
                }}
              >
                Ingreso
              </button>
            </div>
            <form
              className="form-panel"
              onSubmit={(event) => {
                if (financeType === 'income') {
                  handleIncomeSubmit(event);
                } else {
                  handleExpenseSubmit(event);
                }
              }}
            >
              <input
                placeholder="Nombre"
                value={financeType === 'income' ? incomeForm.title : expenseForm.title}
                onChange={(e) => {
                  if (financeType === 'income') {
                    setIncomeForm({ ...incomeForm, title: e.target.value });
                  } else {
                    setExpenseForm({ ...expenseForm, title: e.target.value });
                  }
                }}
              />
              <input
                type="number"
                placeholder="Valor"
                value={financeType === 'income' ? incomeForm.amount : expenseForm.amount}
                onChange={(e) => {
                  if (financeType === 'income') {
                    setIncomeForm({ ...incomeForm, amount: e.target.value });
                  } else {
                    setExpenseForm({ ...expenseForm, amount: e.target.value });
                  }
                }}
              />
              {financeType === 'income' ? (
                <input
                  placeholder="Fuente"
                  value={incomeForm.source}
                  onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                />
              ) : (
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                >
                  <option value="FOOD">Comida</option>
                  <option value="TRANSPORT">Transporte</option>
                  <option value="STUDY">Estudio</option>
                  <option value="HEALTH">Salud</option>
                  <option value="ENTERTAINMENT">Entretenimiento</option>
                  <option value="SERVICES">Servicios</option>
                  <option value="OTHER">Otro</option>
                </select>
              )}
              {financeType === 'expense' && (
                <input
                  placeholder="Descripción"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                />
              )}
              <button disabled={loading}>
                {loading ? 'Guardando...' : financeType === 'income' ? 'Guardar ingreso' : 'Guardar gasto'}
              </button>
            </form>
          )}

          <section className="finance-stats">
            <StatCard value={`$${totalIncome.toLocaleString('es-CO')}`} label="INGRESOS" color="green" />
            <StatCard value={`$${totalExpenses.toLocaleString('es-CO')}`} label="GASTOS" color="red" />
            <StatCard value={`$${balance.toLocaleString('es-CO')}`} label="BALANCE" color={balance >= 0 ? 'green' : 'red'} />
            <StatCard value={expenses.length + incomes.length} label="MOVIMIENTOS" color="yellow" />
          </section>

          <div className="finance-layout">
            <article className="panel">
              <PanelTitle icon="📥" title="Ingresos recientes" />
              {incomes.length === 0 ? (
                <EmptyState text="Sin ingresos registrados" />
              ) : (
                incomes.map((income) => (
                  <ListRow
                    key={income.id}
                    title={income.title}
                    subtitle={`$${Number(income.amount).toLocaleString('es-CO')} · ${income.source ?? 'Sin fuente'}`}
                    actions={
                      <div className="row-actions">
                        <button type="button" onClick={() => handleEditIncome(income)}>
                          Editar
                        </button>
                        <button className="delete-button" type="button" onClick={() => handleDelete('/incomes', income.id)}>
                          Eliminar
                        </button>
                      </div>
                    }
                  />
                ))
              )}
            </article>

            <article className="panel">
              <PanelTitle icon="💸" title="Gastos recientes" />
              {expenses.length === 0 ? (
                <EmptyState text="Sin gastos registrados" />
              ) : (
                expenses.map((expense) => (
                  <ListRow
                    key={expense.id}
                    title={expense.title}
                    subtitle={`$${Number(expense.amount).toLocaleString('es-CO')} · ${expense.category}`}
                    actions={
                      <div className="row-actions">
                        <button type="button" onClick={() => handleEditExpense(expense)}>
                          Editar
                        </button>
                        <button className="delete-button" type="button" onClick={() => handleDelete('/expenses', expense.id)}>
                          Eliminar
                        </button>
                      </div>
                    }
                  />
                ))
              )}
            </article>
          </div>
        </section>
      )}

      {activeTab === 'habits' && (
        <section>
          <SectionHeader title="Hábitos" buttonText="+ Nuevo hábito" onClick={() => setShowForm(!showForm)} />

          {showForm && (
            <form className="form-panel" onSubmit={handleHabitSubmit}>
              <input
                placeholder="Nombre del hábito"
                value={habitForm.name}
                onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
              />
              <input
                placeholder="Descripción"
                value={habitForm.description}
                onChange={(e) => setHabitForm({ ...habitForm, description: e.target.value })}
              />
              <select
                value={habitForm.status}
                onChange={(e) => setHabitForm({ ...habitForm, status: e.target.value })}
              >
                <option value="PENDING">Pendiente</option>
                <option value="DONE">Completado</option>
                <option value="SKIPPED">Omitido</option>
              </select>
              <input
                type="number"
                min="1"
                placeholder="Objetivo de días"
                value={habitForm.targetDays}
                onChange={(e) => setHabitForm({ ...habitForm, targetDays: e.target.value })}
              />
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar hábito'}</button>
            </form>
          )}

          <section className="finance-stats">
            <StatCard value={habits.length} label="HÁBITOS" color="purple" />
            <StatCard value={`${completedHabits}/${habits.length}`} label="COMPLETADOS" color="green" />
            <StatCard value={`${pendingHabits}`} label="PENDIENTES" color="yellow" />
            <StatCard value="Racha" label="DETALLES" color="red" />
          </section>

          <section className="habits-grid">
            {habits.length === 0 ? (
              <EmptyState text="Sin hábitos configurados" />
            ) : (
              habits.map((habit) => (
                <article className="habit-card" key={habit.id}>
                  <div className="habit-head">
                    <div>
                      <strong>{habit.name}</strong>
                      <p>{habit.description ?? 'Meta diaria'}</p>
                    </div>
                    <span>{habit.status === 'DONE' ? '✔' : '⏳'}</span>
                  </div>

                  <div className="mini-progress" />
                  <div className="habit-meta">
                    <span>Racha: {habit.streak} días</span>
                    <span>{Math.round((habit.streak / habit.targetDays) * 100)}% hoy</span>
                  </div>

                  <div className="habit-days">
                    {Array.from({ length: 7 }, (_, index) => (
                      <button key={index} className={index === 6 ? 'today' : ''} />
                    ))}
                  </div>

                  <div className="row-actions">
                    <button type="button" onClick={() => handleEditHabit(habit)}>
                      Editar
                    </button>
                    <button className="delete-button" type="button" onClick={() => handleDelete('/habits', habit.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </section>
      )}

      {activeTab === 'reminders' && (
        <section>
          <SectionHeader
            title="Recordatorios"
            buttonText="+ Nuevo recordatorio"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <form className="form-panel" onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError('');

              try {
                await api.post('/reminders', {
                  title: reminderForm.title,
                  description: reminderForm.description || undefined,
                  remindAt: new Date(reminderForm.remindAt).toISOString(),
                  priority: reminderForm.priority,
                  status: 'PENDING',
                });
                setReminderForm({ title: '', description: '', remindAt: '', priority: 'MEDIUM' });
                setShowForm(false);
                await loadData();
              } catch (error) {
                await handleApiError(error);
              } finally {
                setLoading(false);
              }
            }}>
              <input
                placeholder="Título"
                value={reminderForm.title}
                onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
              />
              <input
                placeholder="Descripción"
                value={reminderForm.description}
                onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
              />
              <input
                type="datetime-local"
                value={reminderForm.remindAt}
                onChange={(e) => setReminderForm({ ...reminderForm, remindAt: e.target.value })}
              />
              <select
                value={reminderForm.priority}
                onChange={(e) => setReminderForm({ ...reminderForm, priority: e.target.value })}
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </form>
          )}

          <section className="finance-stats">
            <StatCard value={reminders.length} label="TOTAL" color="purple" />
            <StatCard value={reminders.filter((item) => item.status === 'DONE').length} label="COMPLETADOS" color="green" />
            <StatCard value={reminders.filter((item) => item.status === 'PENDING').length} label="PENDIENTES" color="yellow" />
            <StatCard value={reminders.filter((item) => item.priority === 'HIGH').length} label="ALTA PRIORIDAD" color="red" />
          </section>

          <article className="panel movements-panel">
            <PanelTitle icon="🔔" title="Recordatorios activos" />
            {reminders.length === 0 ? (
              <EmptyState text="Sin recordatorios activos" />
            ) : (
              reminders.map((reminder) => (
                <ListRow
                  key={reminder.id}
                  title={reminder.title}
                  subtitle={`${reminder.status} · ${reminder.priority} · ${formatDate(reminder.remindAt)}`}
                  actions={
                    <button className="delete-button" type="button" onClick={() => handleDelete('/reminders', reminder.id)}>
                      Eliminar
                    </button>
                  }
                />
              ))
            )}
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
