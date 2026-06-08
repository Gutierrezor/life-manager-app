
import type { View } from '../../App';

interface DashboardProps {
  notes: any[];
  reminders: any[];
  habits: any[];
  transactions: any[];
  finSummary: any;
  formatAmount: (v: any) => string;
  setActive: (v: View) => void;
}

export default function Dashboard({ notes, reminders, habits, transactions, finSummary, formatAmount, setActive }: DashboardProps) {
  const pendingReminders = reminders.filter((r: any) => r.status === 'PENDING' || !r.status);
  const today = new Date().toISOString().slice(0, 10);
  const habitsCompletedToday = habits.filter((h: any) =>
    (h.logs || []).some((l: any) => l.completed && new Date(l.date).toISOString().slice(0, 10) === today)
  ).length;

  return (
    <div className="dashboard-grid">
      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-tile blue" onClick={() => setActive('notes')}>
          <div className="stat-number">{notes.length}</div>
          <div className="stat-label">Notas</div>
          <div className="stat-action">Ver notas →</div>
        </div>
        <div className="stat-tile teal" onClick={() => setActive('reminders')}>
          <div className="stat-number">{pendingReminders.length}</div>
          <div className="stat-label">Recordatorios</div>
          <div className="stat-action">Pendientes →</div>
        </div>
        <div className="stat-tile purple" onClick={() => setActive('habits')}>
          <div className="stat-number">{habitsCompletedToday}/{habits.length}</div>
          <div className="stat-label">Hábitos hoy</div>
          <div className="stat-action">Ver hábitos →</div>
        </div>
        <div className="stat-tile green" onClick={() => setActive('finances')}>
          <div className="stat-number">{finSummary ? formatAmount(finSummary.balance) : '—'}</div>
          <div className="stat-label">Balance</div>
          <div className="stat-action">Ver finanzas →</div>
        </div>
      </div>

      {/* Finance summary */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h2>Resumen financiero</h2>
          <button className="card-link-btn" onClick={() => setActive('finances')}>Ver todo</button>
        </div>
        <div className="fin-summary-row">
          <div className="fin-summary-item income">
            <span className="fin-label">Ingresos</span>
            <strong>{finSummary?.totalIncome != null ? formatAmount(finSummary.totalIncome) : '—'}</strong>
          </div>
          <div className="fin-summary-divider" />
          <div className="fin-summary-item expense">
            <span className="fin-label">Gastos</span>
            <strong>{finSummary?.totalExpense != null ? formatAmount(finSummary.totalExpense) : '—'}</strong>
          </div>
          <div className="fin-summary-divider" />
          <div className="fin-summary-item balance">
            <span className="fin-label">Balance</span>
            <strong>{finSummary?.balance != null ? formatAmount(finSummary.balance) : '—'}</strong>
          </div>
        </div>
        <div className="recent-txs">
          {transactions.length === 0 ? (
            <div className="empty-mini">Sin transacciones aún</div>
          ) : (
            transactions.slice(0, 5).map((t: any) => (
              <div className="tx-row" key={t.id}>
                <div className={`tx-dot ${t.type === 'INCOME' ? 'income' : 'expense'}`} />
                <span className="tx-desc">{t.description || 'Transacción'}</span>
                <span className={`tx-amount ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                  {t.type === 'INCOME' ? '+' : '-'}{formatAmount(t.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent notes */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h2>Notas recientes</h2>
          <button className="card-link-btn" onClick={() => setActive('notes')}>Ver todo</button>
        </div>
        {notes.length === 0 ? (
          <div className="empty-mini">No hay notas. ¡Crea una!</div>
        ) : (
          <div className="notes-preview">
            {notes.slice(0, 4).map((n: any) => (
              <div className="note-preview-card" key={n.id}>
                <strong>{n.title}</strong>
                <p>{n.content?.slice(0, 80)}{n.content?.length > 80 ? '…' : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming reminders */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h2>Próximos recordatorios</h2>
          <button className="card-link-btn" onClick={() => setActive('reminders')}>Ver todo</button>
        </div>
        {pendingReminders.length === 0 ? (
          <div className="empty-mini">Sin recordatorios pendientes</div>
        ) : (
          pendingReminders.slice(0, 5).map((r: any) => (
            <div className="reminder-row" key={r.id}>
              <div className="reminder-dot" />
              <div className="reminder-info">
                <strong>{r.title}</strong>
                <span>{new Date(r.remindAt).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Habit tracker today */}
      <div className="dash-card">
        <div className="dash-card-header">
          <h2>Hábitos de hoy</h2>
          <button className="card-link-btn" onClick={() => setActive('habits')}>Ver todo</button>
        </div>
        {habits.length === 0 ? (
          <div className="empty-mini">No hay hábitos registrados</div>
        ) : (
          <div className="habit-today-list">
            {habits.slice(0, 6).map((h: any) => {
              const done = (h.logs || []).some((l: any) => l.completed && new Date(l.date).toISOString().slice(0, 10) === today);
              return (
                <div className={`habit-today-row ${done ? 'done' : ''}`} key={h.id}>
                  <div className="habit-check">{done ? '✓' : '○'}</div>
                  <span>{h.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
