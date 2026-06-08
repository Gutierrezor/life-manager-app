import React, { useState } from 'react';
import { api, getApiErrorMessage } from '../../api/api';

interface RemindersModuleProps {
  reminders: any[];
  reload: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export default function RemindersModule({ reminders, reload, showToast }: RemindersModuleProps) {
  const [form, setForm] = useState({ title: '', description: '', remindAt: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', remindAt: '' });
  const [filterStatus, setFilterStatus] = useState('');

  async function create(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.title.trim()) return;
    try {
      await api.post('/reminders', { title: form.title, description: form.description || undefined, remindAt: form.remindAt ? new Date(form.remindAt).toISOString() : new Date().toISOString() });
      setForm({ title: '', description: '', remindAt: '' });
      await reload();
      showToast('Recordatorio creado', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function remove(id: number) {
    if (!confirm('¿Eliminar este recordatorio?')) return;
    try {
      await api.delete(`/reminders/${id}`);
      await reload();
      showToast('Recordatorio eliminado', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await api.patch(`/reminders/${id}`, { status });
      await reload();
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function saveEdit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingId) return;
    try {
      await api.patch(`/reminders/${editingId}`, { title: editForm.title, description: editForm.description, remindAt: editForm.remindAt ? new Date(editForm.remindAt).toISOString() : undefined });
      setEditingId(null);
      await reload();
      showToast('Recordatorio actualizado', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  function startEdit(r: any) {
    setEditingId(r.id);
    const dt = new Date(r.remindAt);
    const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setEditForm({ title: r.title, description: r.description || '', remindAt: local });
  }

  const filtered = filterStatus ? reminders.filter((r: any) => r.status === filterStatus) : reminders;
  const sorted = [...filtered].sort((a, b) => new Date(a.remindAt).getTime() - new Date(b.remindAt).getTime());

  return (
    <div className="module-layout">
      <div className="module-sidebar">
        <div className="form-card">
          <h3>Nuevo recordatorio</h3>
          <form onSubmit={create}>
            <div className="field">
              <label>Título</label>
              <input placeholder="¿Qué no debes olvidar?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Descripción</label>
              <textarea rows={3} placeholder="Detalles opcionales…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="field">
              <label>Fecha y hora</label>
              <input type="datetime-local" value={form.remindAt} onChange={(e) => setForm({ ...form, remindAt: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary">Crear recordatorio</button>
          </form>
        </div>
      </div>

      <div className="module-content">
        <div className="content-toolbar">
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="COMPLETED">Completados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
          <div className="toolbar-stats">
            <span className="badge-count pending">{reminders.filter(r => r.status === 'PENDING' || !r.status).length} pendientes</span>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">
            <span>◉</span>
            <p>Sin recordatorios. ¡Añade uno!</p>
          </div>
        ) : (
          <div className="list-stack">
            {sorted.map((r: any) => {
              const isPast = new Date(r.remindAt) < new Date() && r.status !== 'COMPLETED';
              return (
                <div className={`list-card ${r.status === 'COMPLETED' ? 'completed' : ''} ${isPast && r.status !== 'COMPLETED' ? 'overdue' : ''}`} key={r.id}>
                  {editingId === r.id ? (
                    <form onSubmit={saveEdit} className="edit-form">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                      <input type="datetime-local" value={editForm.remindAt} onChange={(e) => setEditForm({ ...editForm, remindAt: e.target.value })} />
                      <div className="edit-actions">
                        <button type="submit" className="btn-primary btn-sm">Guardar</button>
                        <button type="button" className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="list-card-body">
                        <div className="list-card-title">
                          <strong>{r.title}</strong>
                          <span className={`status-badge ${(r.status || 'PENDING').toLowerCase()}`}>
                            {STATUS_LABELS[r.status || 'PENDING']}
                          </span>
                        </div>
                        {r.description && <p>{r.description}</p>}
                        <span className={`date-label ${isPast ? 'overdue' : ''}`}>
                          {isPast && r.status !== 'COMPLETED' ? '⚠ ' : ''}
                          {new Date(r.remindAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <div className="card-actions">
                        {r.status !== 'COMPLETED' && (
                          <button className="btn-success btn-sm" onClick={() => updateStatus(r.id, 'COMPLETED')}>✓ Listo</button>
                        )}
                        <button className="btn-ghost btn-sm" onClick={() => startEdit(r)}>Editar</button>
                        <button className="btn-danger btn-sm" onClick={() => remove(r.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
