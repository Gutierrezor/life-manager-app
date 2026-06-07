import React, { useEffect, useState } from 'react';
import { api } from './api/api';
import './App.css';
import CalendarView from './components/CalendarView';
import Toast from './components/Toast';

type View = 'dashboard' | 'notes' | 'calendar' | 'reminders' | 'habits' | 'finances';

function App() {
  const [active, setActive] = useState<View>('dashboard');
  const [notes, setNotes] = useState<any[]>([]);
  const [noteCategories, setNoteCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [habits, setHabits] = useState<any[]>([]);
  const [habitForm, setHabitForm] = useState({ name: '', description: '', frequency: 'DAILY', goal: '', color: '' });
  const [finSummary, setFinSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [finCategories, setFinCategories] = useState<any[]>([]);
  const [currency, setCurrency] = useState<'COP' | 'USD'>(() => (localStorage.getItem('lm:currency') as 'COP' | 'USD') || 'COP');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; message: string; type?: 'success' | 'error' }[]>([]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((s) => [...s, { id, message, type }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 4000);
  }

  // Form state
  const [noteForm, setNoteForm] = useState({ title: '', content: '', categoryId: '' });
  const [txForm, setTxForm] = useState({ type: 'EXPENSE', amount: '', description: '', categoryId: '' });
  const [remForm, setRemForm] = useState({ title: '', description: '', remindAt: '' });

  async function loadAll() {
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
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function createNote(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      await api.post('/notes', {
        title: noteForm.title,
        content: noteForm.content,
        categoryId: noteForm.categoryId ? Number(noteForm.categoryId) : undefined,
        userId: 1,
      });
      setNoteForm({ title: '', content: '', categoryId: '' });
      await loadAll();
      showToast('Nota creada', 'success');
      setActive('notes');
    } catch (err) {
      console.error('Failed to create note', err);
      showToast('Error creando nota', 'error');
    }
  }

  async function createTransaction(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      await api.post('/finances/transactions', {
        type: txForm.type,
        amount: Number(txForm.amount || 0),
        description: txForm.description || undefined,
        transactionDate: new Date().toISOString(),
        userId: 1,
        categoryId: txForm.categoryId ? Number(txForm.categoryId) : undefined,
      });
      setTxForm({ type: 'EXPENSE', amount: '', description: '', categoryId: '' });
      await loadAll();
      showToast('Transacción registrada', 'success');
      setActive('finances');
    } catch (err) {
      console.error('Failed to create transaction', err);
      showToast('Error registrando transacción', 'error');
    }
  }

  function formatAmount(amount: any) {
    const val = typeof amount === 'string' ? Number(amount) : amount;
    if (Number.isNaN(val)) return amount;
    const locale = currency === 'COP' ? 'es-CO' : 'en-US';
    const opt: Intl.NumberFormatOptions = { style: 'currency', currency };
    return new Intl.NumberFormat(locale, opt).format(val);
  }

  async function createReminder(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      await api.post('/reminders', {
        title: remForm.title,
        description: remForm.description || undefined,
        remindAt: remForm.remindAt || new Date().toISOString(),
        userId: 1,
      });
      setRemForm({ title: '', description: '', remindAt: '' });
      await loadAll();
      showToast('Recordatorio creado', 'success');
      setActive('reminders');
    } catch (err) {
      console.error('Failed to create reminder', err);
      showToast('Error creando recordatorio', 'error');
    }
  }

  async function createHabit(e?: React.FormEvent) {
    e?.preventDefault();
    try {
      await api.post('/habits', {
        name: habitForm.name,
        description: habitForm.description || undefined,
        frequency: habitForm.frequency,
        goal: habitForm.goal ? Number(habitForm.goal) : undefined,
        color: habitForm.color || undefined,
        userId: 1,
      });
      setHabitForm({ name: '', description: '', frequency: 'DAILY', goal: '', color: '' });
      await loadAll();
      showToast('Hábito creado', 'success');
      setActive('habits');
    } catch (err) {
      console.error('Failed to create habit', err);
      showToast('Error creando hábito', 'error');
    }
              }

  function isoDate(d: Date) {
    return d.toISOString().slice(0, 10);
  }

  async function toggleHabitToday(habit: any) {
    try {
      const today = isoDate(new Date());
      // find today's log if any
      const todayLog = (habit.logs || []).find((l: any) => (new Date(l.date)).toISOString().slice(0, 10) === today);
      const payload = { date: today, userId: 1, completed: !(todayLog?.completed ?? false) };
      await api.post(`/habits/${habit.id}/check`, payload);
      await loadAll();
    } catch (err) {
      console.error('Failed to toggle habit', err);
    }
  }

  if (loading) return <div className="app">Cargando datos...</div>;

  return (
    <main className="app">
      <Toast toasts={toasts} />
      <header className="navbar">
        <div className="brand">
          <span>✦</span>
          <strong>LifeManager App</strong>
        </div>
        <nav className="nav-actions">
          <button className={active === 'dashboard' ? 'active' : ''} onClick={() => setActive('dashboard')}>Dashboard</button>
          <button className={active === 'notes' ? 'active' : ''} onClick={() => setActive('notes')}>Notas ({notes.length})</button>
          <button className={active === 'calendar' ? 'active' : ''} onClick={() => setActive('calendar')}>Calendario ({events.length})</button>
          <button className={active === 'reminders' ? 'active' : ''} onClick={() => setActive('reminders')}>Recordatorios ({reminders.length})</button>
          <button className={active === 'habits' ? 'active' : ''} onClick={() => setActive('habits')}>Hábitos ({habits.length})</button>
          <button className={active === 'finances' ? 'active' : ''} onClick={() => setActive('finances')}>Finanzas</button>
          <select value={currency} onChange={(e) => { const v = e.target.value as 'COP' | 'USD'; setCurrency(v); localStorage.setItem('lm:currency', v); }}>
            <option value="COP">COP</option>
            <option value="USD">USD</option>
          </select>
        </nav>
      </header>

      {active === 'dashboard' && (
        <section className="dashboard">
          <article className="panel">
            <div className="section-header">
              <h1>Resumen financiero</h1>
              <div className="section-actions" />
            </div>
            <div className="finance-stats">
              <div className="stat-card purple">
                <strong>{finSummary?.balance ? formatAmount(finSummary.balance) : '—'}</strong>
                <span>Balance</span>
              </div>
              <div className="stat-card green">
                <strong>{finSummary?.income ? formatAmount(finSummary.income) : '—'}</strong>
                <span>Ingresos</span>
              </div>
              <div className="stat-card red">
                <strong>{finSummary?.expenses ? formatAmount(finSummary.expenses) : '—'}</strong>
                <span>Gastos</span>
              </div>
              <div className="stat-card">
                <strong>{transactions.length}</strong>
                <span>Transacciones</span>
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="section-header">
              <h1>Transacciones recientes</h1>
              <div />
            </div>
            <div className="movements-panel">
              {transactions.length === 0 ? (
                <div className="empty-state"><span>🪙</span>No hay transacciones</div>
              ) : (
                transactions.slice(0, 10).map((t: any) => (
                  <div className="list-row" key={t.id}>
                    <div>
                      <strong>{t.description ?? t.title ?? 'Transacción'}</strong>
                      <p>{formatAmount(t.amount)} — {t.type}</p>
                    </div>
                    <div>{new Date(t.transactionDate).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="panel">
            <div className="section-header">
              <h1>Notas recientes</h1>
            </div>
            {notes.length === 0 ? (
              <div className="empty-state"><span>✍️</span>No hay notas</div>
            ) : (
              notes.slice(0, 10).map((n: any) => (
                <div className="list-row" key={n.id}>
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.content}</p>
                  </div>
                </div>
              ))
            )}
          </article>
        </section>
      )}

      {active === 'notes' && (
        <section>
          <div className="panel">
            <div className="section-header">
              <h1>Notas</h1>
              <div />
            </div>

            <form className="form-panel" onSubmit={createNote}>
              <input placeholder="Título" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} />
              <input placeholder="Contenido" value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} />
              <select value={noteForm.categoryId} onChange={(e) => setNoteForm({ ...noteForm, categoryId: e.target.value })}>
                <option value="">Sin categoría</option>
                {noteCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit">Crear nota</button>
            </form>

            <div>
              {notes.length === 0 ? <div className="empty-state">No hay notas</div> : notes.map((n: any) => (
                <div className="list-row" key={n.id}>
                  <div>
                    <strong>{n.title}</strong>
                    <p>{n.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {active === 'reminders' && (
        <section>
          <div className="panel">
            <div className="section-header">
              <h1>Recordatorios</h1>
            </div>

            <form className="form-panel" onSubmit={createReminder}>
              <input placeholder="Título" value={remForm.title} onChange={(e) => setRemForm({ ...remForm, title: e.target.value })} />
              <input placeholder="Descripción" value={remForm.description} onChange={(e) => setRemForm({ ...remForm, description: e.target.value })} />
              <input type="datetime-local" value={remForm.remindAt} onChange={(e) => setRemForm({ ...remForm, remindAt: e.target.value })} />
              <button type="submit">Crear recordatorio</button>
            </form>

            <div>
              {reminders.length === 0 ? <div className="empty-state">No hay recordatorios</div> : reminders.map((r: any) => (
                <div className="list-row" key={r.id}>
                  <div>
                    <strong>{r.title}</strong>
                    <p>{r.description}</p>
                  </div>
                  <div>{new Date(r.remindAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {active === 'finances' && (
        <section>
          <div className="panel">
            <div className="section-header">
              <h1>Finanzas</h1>
            </div>

            <form className="form-panel" onSubmit={createTransaction}>
              <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value })}>
                <option value="EXPENSE">Gasto</option>
                <option value="INCOME">Ingreso</option>
              </select>
              <input placeholder="Monto" type="number" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} />
              <input placeholder="Descripción" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} />
              <select value={txForm.categoryId} onChange={(e) => setTxForm({ ...txForm, categoryId: e.target.value })}>
                <option value="">Sin categoría</option>
                {finCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit">Registrar</button>
            </form>

            <div className="finance-layout">
              <div>
                <h3>Resumen</h3>
                <pre>{finSummary ? JSON.stringify(finSummary, null, 2) : 'Sin resumen'}</pre>
              </div>
              <div>
                <h3>Movimientos</h3>
                {transactions.length === 0 ? <div className="empty-state">No hay transacciones</div> : transactions.map((t: any) => (
                  <div className="list-row" key={t.id}>
                    <div>
                      <strong>{t.description ?? t.title}</strong>
                      <p>{formatAmount(t.amount)} — {t.type}</p>
                    </div>
                    <div>{new Date(t.transactionDate).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {active === 'calendar' && (
        <section>
          <div className="panel">
            <div className="section-header">
              <h1>Calendario</h1>
              <div />
            </div>

            <CalendarView
              events={events}
              onCreate={async (data) => {
                try {
                  await api.post('/calendar-events', { ...data, userId: 1 });
                  await loadAll();
                  showToast('Evento creado', 'success');
                } catch (err) {
                  console.error('Failed to create event', err);
                  showToast('Error creando evento', 'error');
                }
              }}
              onUpdate={async (id, updates) => {
                try {
                  await api.patch(`/calendar-events/${id}`, updates);
                  await loadAll();
                  showToast('Evento actualizado', 'success');
                } catch (err) {
                  console.error('Failed to update event', err);
                  showToast('Error actualizando evento', 'error');
                }
              }}
              onDelete={async (id) => {
                try {
                  await api.delete(`/calendar-events/${id}`);
                  await loadAll();
                  showToast('Evento eliminado', 'success');
                } catch (err) {
                  console.error('Failed to delete event', err);
                  showToast('Error eliminando evento', 'error');
                }
              }}
            />
          </div>
        </section>
      )}

      {active === 'habits' && (
        <section>
          <div className="panel">
            <div className="section-header">
              <h1>Hábitos</h1>
            </div>

            <form className="form-panel" onSubmit={createHabit}>
              <input placeholder="Nombre del hábito" value={habitForm.name} onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })} />
              <input placeholder="Descripción" value={habitForm.description} onChange={(e) => setHabitForm({ ...habitForm, description: e.target.value })} />
              <select value={habitForm.frequency} onChange={(e) => setHabitForm({ ...habitForm, frequency: e.target.value })}>
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
              <input placeholder="Meta (veces)" type="number" value={habitForm.goal} onChange={(e) => setHabitForm({ ...habitForm, goal: e.target.value })} />
              <input placeholder="Color (hex)" value={habitForm.color} onChange={(e) => setHabitForm({ ...habitForm, color: e.target.value })} />
              <button type="submit">Crear hábito</button>
            </form>

            {habits.length === 0 ? <div className="empty-state">No hay hábitos</div> : (
              <div className="habits-grid">
                {habits.map((h: any) => {
                  const today = new Date();
                  const past7: string[] = [];
                  for (let i = 6; i >= 0; i--) {
                    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
                    past7.push(d.toISOString().slice(0, 10));
                  }
                  const completedSet = new Set((h.logs || []).filter((l: any) => l.completed).map((l: any) => (new Date(l.date)).toISOString().slice(0, 10)));
                  const todayDone = completedSet.has(new Date().toISOString().slice(0, 10));

                  return (
                    <div className="habit-card" key={h.id}>
                      <div className="habit-head">
                        <strong>{h.name}</strong>
                        <div>
                          <button className={todayDone ? 'btn-done' : ''} onClick={() => toggleHabitToday(h)}>{todayDone ? 'Hecho hoy' : 'Marcar hoy'}</button>
                        </div>
                      </div>
                      <div className="habit-meta">{h.description}</div>

                      <div className="habit-tracker">
                        {past7.map((d) => (
                          <div key={d} className={completedSet.has(d) ? 'dot done' : 'dot'} title={d}></div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
