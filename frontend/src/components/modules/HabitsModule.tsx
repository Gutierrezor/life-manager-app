import React, { useState } from 'react';
import { api, getApiErrorMessage } from '../../api/api';

interface HabitsModuleProps {
  habits: any[];
  reload: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function HabitsModule({ habits, reload, showToast }: HabitsModuleProps) {
  const [form, setForm] = useState({ name: '', description: '', frequency: 'DAILY', goal: '', color: '#7c5cff' });

  async function create(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.post('/habits', { name: form.name, description: form.description || undefined, frequency: form.frequency, goal: form.goal ? Number(form.goal) : undefined, color: form.color || undefined });
      setForm({ name: '', description: '', frequency: 'DAILY', goal: '', color: '#7c5cff' });
      await reload();
      showToast('Hábito creado', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function remove(id: number) {
    if (!confirm('¿Eliminar este hábito?')) return;
    try {
      await api.delete(`/habits/${id}`);
      await reload();
      showToast('Hábito eliminado', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function toggle(habit: any) {
    try {
      const today = isoDate(new Date());
      const todayLog = (habit.logs || []).find((l: any) => new Date(l.date).toISOString().slice(0, 10) === today);
      await api.post(`/habits/${habit.id}/check`, { date: today, completed: !(todayLog?.completed ?? false) });
      await reload();
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  const today = new Date();
  const past7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - i));
    return { key: isoDate(d), label: d.toLocaleDateString('es-CO', { weekday: 'short' }).slice(0, 2).toUpperCase(), num: d.getDate() };
  });
  const todayKey = isoDate(today);

  function streak(habit: any) {
    const completedSet = new Set((habit.logs || []).filter((l: any) => l.completed).map((l: any) => new Date(l.date).toISOString().slice(0, 10)));
    let count = 0;
    const cur = new Date();
    while (true) {
      const k = isoDate(cur);
      if (!completedSet.has(k)) break;
      count++;
      cur.setDate(cur.getDate() - 1);
    }
    return count;
  }

  return (
    <div className="module-layout">
      <div className="module-sidebar">
        <div className="form-card">
          <h3>Nuevo hábito</h3>
          <form onSubmit={create}>
            <div className="field">
              <label>Nombre</label>
              <input placeholder="Ej: Meditar 10 min" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <label>Descripción</label>
              <input placeholder="Descripción opcional" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field">
              <label>Frecuencia</label>
              <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                <option value="DAILY">Diario</option>
                <option value="WEEKLY">Semanal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </div>
            <div className="field">
              <label>Meta (repeticiones)</label>
              <input type="number" placeholder="Ej: 1" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
            </div>
            <div className="field field-row">
              <label>Color</label>
              <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary">Crear hábito</button>
          </form>
        </div>
      </div>

      <div className="module-content">
        {habits.length === 0 ? (
          <div className="empty-state">
            <span>◎</span>
            <p>No hay hábitos. ¡Empieza uno hoy!</p>
          </div>
        ) : (
          <div className="habits-list">
            {habits.map((h: any) => {
              const completedSet = new Set((h.logs || []).filter((l: any) => l.completed).map((l: any) => new Date(l.date).toISOString().slice(0, 10)));
              const todayDone = completedSet.has(todayKey);
              const currentStreak = streak(h);
              const color = h.color || '#7c5cff';

              return (
                <div className="habit-card-new" key={h.id} style={{ '--habit-color': color } as any}>
                  <div className="habit-card-top">
                    <div className="habit-card-left">
                      <div className="habit-color-dot" style={{ background: color }} />
                      <div>
                        <strong>{h.name}</strong>
                        {h.description && <p>{h.description}</p>}
                      </div>
                    </div>
                    <div className="habit-card-right">
                      {currentStreak > 0 && (
                        <span className="streak-badge">🔥 {currentStreak} días</span>
                      )}
                      <button
                        className={`habit-toggle ${todayDone ? 'done' : ''}`}
                        onClick={() => toggle(h)}
                      >
                        {todayDone ? '✓ Hecho hoy' : 'Marcar hoy'}
                      </button>
                    </div>
                  </div>

                  <div className="habit-week">
                    {past7.map((d) => (
                      <div key={d.key} className={`week-cell ${completedSet.has(d.key) ? 'done' : ''} ${d.key === todayKey ? 'today' : ''}`}>
                        <span className="week-day">{d.label}</span>
                        <span className="week-num">{d.num}</span>
                        <span className="week-status">{completedSet.has(d.key) ? '✓' : '·'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="card-actions">
                    <span className="freq-badge">{h.frequency === 'DAILY' ? 'Diario' : h.frequency === 'WEEKLY' ? 'Semanal' : 'Mensual'}</span>
                    <button className="btn-danger btn-sm" onClick={() => remove(h.id)}>Eliminar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
