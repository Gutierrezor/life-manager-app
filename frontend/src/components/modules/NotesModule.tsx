import React, { useState } from 'react';
import { api, getApiErrorMessage } from '../../api/api';

interface NotesModuleProps {
  notes: any[];
  noteCategories: any[];
  reload: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function NotesModule({ notes, noteCategories, reload, showToast }: NotesModuleProps) {
  const [noteForm, setNoteForm] = useState({ title: '', content: '', categoryId: '' });
  const [catForm, setCatForm] = useState({ name: '', color: '#6366f1' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', categoryId: '' });
  const [filter, setFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  async function createNote(e?: React.FormEvent) {
    e?.preventDefault();
    if (!noteForm.title.trim()) return;
    try {
      await api.post('/notes', { title: noteForm.title, content: noteForm.content, categoryId: noteForm.categoryId ? Number(noteForm.categoryId) : undefined });
      setNoteForm({ title: '', content: '', categoryId: '' });
      await reload();
      showToast('Nota creada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function deleteNote(id: number) {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      await api.delete(`/notes/${id}`);
      await reload();
      showToast('Nota eliminada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function saveEdit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingId) return;
    try {
      await api.patch(`/notes/${editingId}`, { title: editForm.title, content: editForm.content, categoryId: editForm.categoryId ? Number(editForm.categoryId) : undefined });
      setEditingId(null);
      await reload();
      showToast('Nota actualizada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  function startEdit(n: any) {
    setEditingId(n.id);
    setEditForm({ title: n.title, content: n.content || '', categoryId: n.categoryId ? String(n.categoryId) : '' });
  }

  async function createCategory(e?: React.FormEvent) {
    e?.preventDefault();
    if (!catForm.name.trim()) return;
    try {
      await api.post('/note-categories', { name: catForm.name, color: catForm.color });
      setCatForm({ name: '', color: '#6366f1' });
      await reload();
      showToast('Categoría creada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function deleteCategory(id: number) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await api.delete(`/note-categories/${id}`);
      await reload();
      showToast('Categoría eliminada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  const filtered = notes.filter(n => {
    const matchText = !filter || n.title?.toLowerCase().includes(filter.toLowerCase()) || n.content?.toLowerCase().includes(filter.toLowerCase());
    const matchCat = !catFilter || String(n.categoryId) === catFilter;
    return matchText && matchCat;
  });

  return (
    <div className="module-layout">
      <div className="module-sidebar">
        <div className="form-card">
          <h3>Nueva nota</h3>
          <form onSubmit={createNote}>
            <div className="field">
              <label>Título</label>
              <input placeholder="Título de la nota" value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Contenido</label>
              <textarea placeholder="Escribe aquí…" rows={4} value={noteForm.content} onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select value={noteForm.categoryId} onChange={(e) => setNoteForm({ ...noteForm, categoryId: e.target.value })}>
                <option value="">Sin categoría</option>
                {noteCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-primary">Crear nota</button>
          </form>
        </div>

        <div className="form-card">
          <h3>Nueva categoría</h3>
          <form onSubmit={createCategory}>
            <div className="field">
              <label>Nombre</label>
              <input placeholder="Nombre" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
            </div>
            <div className="field field-row">
              <label>Color</label>
              <input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} />
            </div>
            <button type="submit" className="btn-secondary">Crear categoría</button>
          </form>
          <div className="chip-list">
            {noteCategories.map((c: any) => (
              <span className="chip" key={c.id} style={{ '--chip-color': c.color ?? '#6366f1' } as any}>
                <span className="chip-dot" />
                {c.name}
                <button className="chip-del" onClick={() => deleteCategory(c.id)}>×</button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="module-content">
        <div className="content-toolbar">
          <input className="search-input" placeholder="Buscar notas…" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <select className="filter-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">Todas las categorías</option>
            {noteCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>✎</span>
            <p>{filter || catFilter ? 'Sin resultados para tu búsqueda' : 'No hay notas. ¡Crea la primera!'}</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((n: any) => {
              const cat = noteCategories.find((c: any) => c.id === n.categoryId);
              return (
                <div className="note-card" key={n.id}>
                  {editingId === n.id ? (
                    <form onSubmit={saveEdit} className="edit-form">
                      <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                      <textarea rows={3} value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} />
                      <select value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}>
                        <option value="">Sin categoría</option>
                        {noteCategories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <div className="edit-actions">
                        <button type="submit" className="btn-primary btn-sm">Guardar</button>
                        <button type="button" className="btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {cat && (
                        <span className="note-cat" style={{ background: cat.color ?? '#6366f1' }}>{cat.name}</span>
                      )}
                      <strong>{n.title}</strong>
                      <p>{n.content}</p>
                      <div className="card-actions">
                        <button className="btn-ghost btn-sm" onClick={() => startEdit(n)}>Editar</button>
                        <button className="btn-danger btn-sm" onClick={() => deleteNote(n.id)}>Eliminar</button>
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
