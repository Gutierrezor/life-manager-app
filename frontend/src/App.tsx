import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api } from './api/api';
import './App.css';

type Tab = 'reminders' | 'agenda' | 'expenses' | 'habits';

type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
};

type Expense = {
  id: number;
  title: string;
  amount: string;
  category: string;
  description?: string;
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

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('agenda');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [agenda, setAgenda] = useState<AgendaEvent[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [agendaForm, setAgendaForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    description: '',
  });

  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    remindAt: '',
    priority: 'MEDIUM',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
  });

  async function loadData() {
    const [tasksRes, expensesRes, remindersRes, agendaRes] = await Promise.all([
      api.get('/tasks'),
      api.get('/expenses'),
      api.get('/reminders'),
      api.get('/agenda'),
    ]);

    setTasks(tasksRes.data);
    setExpenses(expensesRes.data);
    setReminders(remindersRes.data);
    setAgenda(agendaRes.data);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createAgenda(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!agendaForm.title || !agendaForm.startTime || !agendaForm.endTime) return;

    setLoading(true);

    try {
      await api.post('/agenda', {
        title: agendaForm.title,
        description: agendaForm.description || undefined,
        startTime: new Date(agendaForm.startTime).toISOString(),
        endTime: new Date(agendaForm.endTime).toISOString(),
        location: agendaForm.location || undefined,
      });

      setAgendaForm({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
      });

      setShowForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  async function createExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expenseForm.title || !expenseForm.amount) return;

    setLoading(true);

    try {
      await api.post('/expenses', {
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        description: expenseForm.description || undefined,
      });

      setExpenseForm({
        title: '',
        amount: '',
        category: 'FOOD',
        description: '',
      });

      setShowForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  async function createReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!reminderForm.title || !reminderForm.remindAt) return;

    setLoading(true);

    try {
      await api.post('/reminders', {
        title: reminderForm.title,
        description: reminderForm.description || undefined,
        remindAt: new Date(reminderForm.remindAt).toISOString(),
        priority: reminderForm.priority,
        status: 'PENDING',
      });

      setReminderForm({
        title: '',
        description: '',
        remindAt: '',
        priority: 'MEDIUM',
      });

      setShowForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskForm.title) return;

    setLoading(true);

    try {
      await api.post('/tasks', {
        title: taskForm.title,
        description: taskForm.description || undefined,
        priority: taskForm.priority,
        status: 'PENDING',
      });

      setTaskForm({
        title: '',
        description: '',
        priority: 'MEDIUM',
      });

      setShowForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0,
  );

  const completedTasks = tasks.filter((task) => task.status === 'COMPLETED').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'COMPLETED').length;

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
      </header>

      {activeTab === 'agenda' && (
        <section>
          <SectionHeader
            title="Calendario"
            buttonText="+ Nuevo evento"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <form className="form-panel" onSubmit={createAgenda}>
              <input
                placeholder="Título del evento"
                value={agendaForm.title}
                onChange={(e) =>
                  setAgendaForm({ ...agendaForm, title: e.target.value })
                }
              />
              <input
                placeholder="Descripción"
                value={agendaForm.description}
                onChange={(e) =>
                  setAgendaForm({ ...agendaForm, description: e.target.value })
                }
              />
              <input
                type="datetime-local"
                value={agendaForm.startTime}
                onChange={(e) =>
                  setAgendaForm({ ...agendaForm, startTime: e.target.value })
                }
              />
              <input
                type="datetime-local"
                value={agendaForm.endTime}
                onChange={(e) =>
                  setAgendaForm({ ...agendaForm, endTime: e.target.value })
                }
              />
              <input
                placeholder="Ubicación"
                value={agendaForm.location}
                onChange={(e) =>
                  setAgendaForm({ ...agendaForm, location: e.target.value })
                }
              />
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </form>
          )}

          <div className="calendar-layout">
            <article className="panel calendar-panel">
              <div className="calendar-header">
                <button>‹</button>
                <h2>Mayo 2026</h2>
                <button>›</button>
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
                    subtitle={`${formatDate(event.startTime)} · ${
                      event.location ?? 'Sin ubicación'
                    }`}
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
            buttonText="+ Transacción"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <form className="form-panel" onSubmit={createExpense}>
              <input
                placeholder="Nombre del gasto"
                value={expenseForm.title}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, title: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Valor"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: e.target.value })
                }
              />
              <select
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, category: e.target.value })
                }
              >
                <option value="FOOD">Comida</option>
                <option value="TRANSPORT">Transporte</option>
                <option value="STUDY">Estudio</option>
                <option value="HEALTH">Salud</option>
                <option value="ENTERTAINMENT">Entretenimiento</option>
                <option value="SERVICES">Servicios</option>
                <option value="OTHER">Otro</option>
              </select>
              <input
                placeholder="Descripción"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
              />
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </form>
          )}

          <section className="finance-stats">
            <StatCard value="$0" label="INGRESOS" color="green" />
            <StatCard
              value={`$${totalExpenses.toLocaleString('es-CO')}`}
              label="GASTOS"
              color="red"
            />
            <StatCard
              value={`-$${totalExpenses.toLocaleString('es-CO')}`}
              label="BALANCE"
              color="green"
            />
            <StatCard value={expenses.length} label="MOVIMIENTOS" color="yellow" />
          </section>

          <div className="finance-layout">
            <article className="panel">
              <PanelTitle icon="◔" title="Por categoría" />

              {expenses.length === 0 ? (
                <EmptyState text="Sin gastos aún" />
              ) : (
                expenses.map((expense) => (
                  <ListRow
                    key={expense.id}
                    title={expense.title}
                    subtitle={`$${Number(expense.amount).toLocaleString(
                      'es-CO',
                    )} · ${expense.category}`}
                  />
                ))
              )}
            </article>

            <article className="panel">
              <PanelTitle icon="◎" title="Meta de ahorro" />
              <div className="saving-box">
                <p>Meta de ahorro</p>
                <div className="saving-line">
                  <span>Ahorrado: $0</span>
                  <span>Meta: $0</span>
                </div>
                <div className="progress">
                  <span />
                </div>
                <small>0% · Faltan $0</small>
                <button className="outline-button">✎ Editar meta</button>
              </div>
            </article>
          </div>

          <article className="panel movements-panel">
            <PanelTitle icon="▤" title="Movimientos" />
            {expenses.map((expense) => (
              <ListRow
                key={expense.id}
                title={expense.title}
                subtitle={`${expense.category} · $${Number(
                  expense.amount,
                ).toLocaleString('es-CO')}`}
              />
            ))}
          </article>
        </section>
      )}

      {activeTab === 'habits' && (
        <section>
          <SectionHeader
            title="Hábitos"
            buttonText="⚙ Configurar"
            onClick={() => setShowForm(!showForm)}
          />

          {showForm && (
            <form className="form-panel" onSubmit={createTask}>
              <input
                placeholder="Nombre del hábito"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
              />
              <input
                placeholder="Meta o descripción"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
              />
              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Media</option>
                <option value="HIGH">Alta</option>
              </select>
              <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
            </form>
          )}

          <section className="finance-stats">
            <StatCard value={tasks.length} label="HÁBITOS" color="purple" />
            <StatCard value={`${completedTasks}/${tasks.length}`} label="HOY COMPLETADOS" color="green" />
            <StatCard value="0" label="MEJOR RACHA (DÍAS)" color="yellow" />
            <StatCard value={pendingTasks} label="PENDIENTES HOY" color="red" />
          </section>

          <section className="habits-grid">
            {tasks.map((task) => (
              <article className="habit-card" key={task.id}>
                <div className="habit-head">
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.description ?? 'Meta diaria'}</p>
                  </div>
                  <span>{task.status === 'COMPLETED' ? '1' : '0'}</span>
                </div>

                <div className="mini-progress" />

                <div className="habit-meta">
                  <span>♨ Racha: 0 días</span>
                  <span>{task.status === 'COMPLETED' ? '100%' : '0%'} hoy</span>
                </div>

                <div className="habit-days">
                  {Array.from({ length: 14 }, (_, index) => (
                    <button key={index} className={index === 13 ? 'today' : ''} />
                  ))}
                </div>

                <button className="register-button">+ Registrar hoy</button>
              </article>
            ))}
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
            <form className="form-panel" onSubmit={createReminder}>
              <input
                placeholder="Título"
                value={reminderForm.title}
                onChange={(e) =>
                  setReminderForm({ ...reminderForm, title: e.target.value })
                }
              />
              <input
                placeholder="Descripción"
                value={reminderForm.description}
                onChange={(e) =>
                  setReminderForm({
                    ...reminderForm,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="datetime-local"
                value={reminderForm.remindAt}
                onChange={(e) =>
                  setReminderForm({ ...reminderForm, remindAt: e.target.value })
                }
              />
              <select
                value={reminderForm.priority}
                onChange={(e) =>
                  setReminderForm({ ...reminderForm, priority: e.target.value })
                }
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
            <StatCard
              value={reminders.filter((item) => item.status === 'DONE').length}
              label="COMPLETADOS"
              color="green"
            />
            <StatCard
              value={reminders.filter((item) => item.status === 'PENDING').length}
              label="PENDIENTES"
              color="yellow"
            />
            <StatCard
              value={reminders.filter((item) => item.priority === 'HIGH').length}
              label="ALTA PRIORIDAD"
              color="red"
            />
          </section>

          <article className="panel movements-panel">
            <PanelTitle icon="🔔" title="Recordatorios activos" />

            {reminders.map((reminder) => (
              <ListRow
                key={reminder.id}
                title={reminder.title}
                subtitle={`${reminder.status} · ${reminder.priority} · ${formatDate(
                  reminder.remindAt,
                )}`}
              />
            ))}
          </article>
        </section>
      )}
    </main>
  );
}

function SectionHeader({
  title,
  buttonText,
  onClick,
}: {
  title: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <section className="section-header">
      <h1>{title}</h1>
      <button onClick={onClick}>{buttonText}</button>
    </section>
  );
}

function PanelTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="panel-title">
      <span>{icon}</span>
      <strong>{title}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <span>▧</span>
      <p>{text}</p>
    </div>
  );
}

function ListRow({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="list-row">
      <strong>{title}</strong>
      <p>{subtitle}</p>
    </div>
  );
}

function StatCard({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: 'green' | 'red' | 'yellow' | 'purple';
}) {
  return (
    <article className={`stat-card ${color}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export default App;
