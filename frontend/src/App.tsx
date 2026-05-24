import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from './api/api';
import './App.css';

type Tab = 'tasks' | 'reminders' | 'agenda' | 'expenses';

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
  const [activeTab, setActiveTab] = useState<Tab>('reminders');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [agenda, setAgenda] = useState<AgendaEvent[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
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

  const [agendaForm, setAgendaForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
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

  const headerTitle = useMemo(() => {
    const titles: Record<Tab, string> = {
      tasks: 'Tareas',
      reminders: 'Recordatorios',
      agenda: 'Calendario',
      expenses: 'Finanzas',
    };

    return titles[activeTab];
  }, [activeTab]);

  async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskForm.title.trim()) return;

    setLoading(true);

    try {
      await api.post('/tasks', {
        title: taskForm.title,
        description: taskForm.description || undefined,
        priority: taskForm.priority,
        status: 'PENDING',
      });

      setTaskForm({ title: '', description: '', priority: 'MEDIUM' });
      setShowForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) return;

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

  async function handleCreateReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reminderForm.title.trim() || !reminderForm.remindAt) return;

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

  async function handleCreateAgenda(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agendaForm.title.trim() || !agendaForm.startTime || !agendaForm.endTime)
      return;

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

  function renderStats() {
    if (activeTab === 'tasks') {
      return (
        <>
          <StatCard value={tasks.length} label="TOTAL" />
          <StatCard
            value={tasks.filter((task) => task.status === 'COMPLETED').length}
            label="LISTAS"
          />
          <StatCard
            value={tasks.filter((task) => task.status === 'PENDING').length}
            label="PENDIENTES"
          />
          <StatCard
            value={tasks.filter((task) => task.priority === 'HIGH').length}
            label="ALTA PRIORIDAD"
          />
        </>
      );
    }

    if (activeTab === 'expenses') {
      const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0,
      );

      return (
        <>
          <StatCard value={expenses.length} label="REGISTROS" />
          <StatCard value={`$${total.toLocaleString('es-CO')}`} label="TOTAL" />
          <StatCard
            value={expenses.filter((expense) => expense.category === 'FOOD').length}
            label="COMIDA"
          />
          <StatCard
            value={expenses.filter((expense) => expense.category === 'OTHER').length}
            label="OTROS"
          />
        </>
      );
    }

    if (activeTab === 'agenda') {
      return (
        <>
          <StatCard value={agenda.length} label="EVENTOS" />
          <StatCard value={agenda.filter(Boolean).length} label="PROGRAMADOS" />
          <StatCard
            value={agenda.filter((event) => event.location).length}
            label="CON UBICACIÓN"
          />
          <StatCard value={0} label="HOY" />
        </>
      );
    }

    return (
      <>
        <StatCard value={reminders.length} label="TOTAL" />
        <StatCard
          value={reminders.filter((reminder) => reminder.status === 'DONE').length}
          label="LISTOS"
        />
        <StatCard
          value={reminders.filter((reminder) => reminder.status === 'PENDING').length}
          label="PENDIENTES"
        />
        <StatCard
          value={reminders.filter((reminder) => reminder.priority === 'HIGH').length}
          label="ALTA PRIORIDAD"
        />
      </>
    );
  }

  function renderForm() {
    if (!showForm) return null;

    if (activeTab === 'tasks') {
      return (
        <form className="form-panel" onSubmit={handleCreateTask}>
          <input
            placeholder="Título de la tarea"
            value={taskForm.title}
            onChange={(event) =>
              setTaskForm({ ...taskForm, title: event.target.value })
            }
          />

          <input
            placeholder="Descripción"
            value={taskForm.description}
            onChange={(event) =>
              setTaskForm({ ...taskForm, description: event.target.value })
            }
          />

          <select
            value={taskForm.priority}
            onChange={(event) =>
              setTaskForm({ ...taskForm, priority: event.target.value })
            }
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>

          <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </form>
      );
    }

    if (activeTab === 'expenses') {
      return (
        <form className="form-panel" onSubmit={handleCreateExpense}>
          <input
            placeholder="Nombre del gasto"
            value={expenseForm.title}
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, title: event.target.value })
            }
          />

          <input
            type="number"
            placeholder="Valor"
            value={expenseForm.amount}
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, amount: event.target.value })
            }
          />

          <select
            value={expenseForm.category}
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, category: event.target.value })
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
            onChange={(event) =>
              setExpenseForm({ ...expenseForm, description: event.target.value })
            }
          />

          <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </form>
      );
    }

    if (activeTab === 'agenda') {
      return (
        <form className="form-panel" onSubmit={handleCreateAgenda}>
          <input
            placeholder="Título del evento"
            value={agendaForm.title}
            onChange={(event) =>
              setAgendaForm({ ...agendaForm, title: event.target.value })
            }
          />

          <input
            placeholder="Descripción"
            value={agendaForm.description}
            onChange={(event) =>
              setAgendaForm({ ...agendaForm, description: event.target.value })
            }
          />

          <input
            type="datetime-local"
            value={agendaForm.startTime}
            onChange={(event) =>
              setAgendaForm({ ...agendaForm, startTime: event.target.value })
            }
          />

          <input
            type="datetime-local"
            value={agendaForm.endTime}
            onChange={(event) =>
              setAgendaForm({ ...agendaForm, endTime: event.target.value })
            }
          />

          <input
            placeholder="Ubicación"
            value={agendaForm.location}
            onChange={(event) =>
              setAgendaForm({ ...agendaForm, location: event.target.value })
            }
          />

          <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </form>
      );
    }

    return (
      <form className="form-panel" onSubmit={handleCreateReminder}>
        <input
          placeholder="Título del recordatorio"
          value={reminderForm.title}
          onChange={(event) =>
            setReminderForm({ ...reminderForm, title: event.target.value })
          }
        />

        <input
          placeholder="Descripción"
          value={reminderForm.description}
          onChange={(event) =>
            setReminderForm({ ...reminderForm, description: event.target.value })
          }
        />

        <input
          type="datetime-local"
          value={reminderForm.remindAt}
          onChange={(event) =>
            setReminderForm({ ...reminderForm, remindAt: event.target.value })
          }
        />

        <select
          value={reminderForm.priority}
          onChange={(event) =>
            setReminderForm({ ...reminderForm, priority: event.target.value })
          }
        >
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
        </select>

        <button disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </form>
    );
  }

  function renderList() {
    if (activeTab === 'tasks') {
      return tasks.map((task) => (
        <ListItem
          key={task.id}
          title={task.title}
          subtitle={`${task.status} · ${task.priority}`}
        />
      ));
    }

    if (activeTab === 'expenses') {
      return expenses.map((expense) => (
        <ListItem
          key={expense.id}
          title={expense.title}
          subtitle={`$${Number(expense.amount).toLocaleString('es-CO')} · ${
            expense.category
          }`}
        />
      ));
    }

    if (activeTab === 'agenda') {
      return agenda.map((event) => (
        <ListItem
          key={event.id}
          title={event.title}
          subtitle={`${event.location ?? 'Sin ubicación'} · ${formatDate(
            event.startTime,
          )}`}
        />
      ));
    }

    return reminders.map((reminder) => (
      <ListItem
        key={reminder.id}
        title={reminder.title}
        subtitle={`${reminder.status} · ${reminder.priority} · ${formatDate(
          reminder.remindAt,
        )}`}
      />
    ));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <h1>MiHub</h1>
          <p>Panel personal para tareas, recordatorios, calendario y finanzas.</p>
        </div>

        <span className="plan-badge">Plan gratuito</span>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'reminders' ? 'active' : ''}
          onClick={() => setActiveTab('reminders')}
        >
          🔔 Recordatorios
        </button>

        <button
          className={activeTab === 'agenda' ? 'active' : ''}
          onClick={() => setActiveTab('agenda')}
        >
          📅 Calendario
        </button>

        <button
          className={activeTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveTab('expenses')}
        >
          💰 Finanzas
        </button>

        <button
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          ✅ Hábitos
        </button>
      </nav>

      <section className="section-header">
        <div>
          <h2>{headerTitle}</h2>
          <p>Gestiona y consulta la información conectada a PostgreSQL.</p>
        </div>

        <button className="new-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cerrar' : '+ Nuevo'}
        </button>
      </section>

      {renderForm()}

      <section className="stats-grid">{renderStats()}</section>

      <section className="list-panel">
        <div className="list-title">☰ Lista</div>

        <div className="list-content">
          {renderList().length > 0 ? (
            renderList()
          ) : (
            <div className="empty-state">
              <span>⌁</span>
              <p>Sin registros. Crea uno nuevo.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <article className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function ListItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <article className="list-item">
      <div>
        <strong>{title}</strong>
        <p>{subtitle}</p>
      </div>
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
