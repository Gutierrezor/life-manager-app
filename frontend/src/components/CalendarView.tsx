import React, { useMemo, useState } from 'react';

type Event = {
  id?: number;
  title: string;
  description?: string;
  startDate: string; // ISO
  endDate?: string; // ISO
  location?: string;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export default function CalendarView({ events, onCreate, onUpdate, onDelete }: { events: any[]; onCreate: (data: Event) => Promise<void>; onUpdate?: (id: number, data: Partial<Event>) => Promise<void>; onDelete?: (id: number) => Promise<void>; }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', date: '', startTime: '09:00', endTime: '', allDay: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', startTime: '09:00', endTime: '', allDay: false });

  const monthDays = useMemo(() => {
    const days: Date[] = [];
    const first = startOfMonth(cursor);
    const firstWeekday = first.getDay();
    // backfill previous month days to align (Sunday=0)
    for (let i = 0; i < firstWeekday; i++) days.push(new Date(first.getFullYear(), first.getMonth(), i - firstWeekday + 1));
    const total = daysInMonth(cursor);
    for (let i = 1; i <= total; i++) days.push(new Date(first.getFullYear(), first.getMonth(), i));
    // fill to complete 6 rows
    while (days.length < 42) {
      const last = days[days.length - 1];
      days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }
    return days;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    events.forEach((ev) => {
      const d = new Date(ev.startDate || ev.start || ev.startDate).toISOString().slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(ev);
    });
    return map;
  }, [events]);

  const goNext = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goPrev = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!form.title || !form.date) return;
    let startDate: string;
    let endDate: string | undefined;
    if (form.allDay) {
      startDate = new Date(`${form.date}T00:00:00Z`).toISOString();
      endDate = new Date(`${form.date}T23:59:59Z`).toISOString();
    } else {
      startDate = new Date(`${form.date}T${form.startTime || '00:00'}:00Z`).toISOString();
      endDate = form.endTime ? new Date(`${form.date}T${form.endTime}:00Z`).toISOString() : undefined;
    }
    await onCreate({ title: form.title, description: form.description, startDate, endDate, location: undefined });
    setForm({ title: '', description: '', date: '', startTime: '09:00', endTime: '', allDay: false });
  }

  async function startEdit(ev: any) {
    setEditingId(ev.id);
    const s = new Date(ev.startDate);
    const e = ev.endDate ? new Date(ev.endDate) : null;
    setEditForm({
      title: ev.title || '',
      description: ev.description || '',
      date: s.toISOString().slice(0, 10),
      startTime: s.toISOString().slice(11, 16),
      endTime: e ? e.toISOString().slice(11, 16) : '',
      allDay: !!(e && s.getUTCHours() === 0 && e.getUTCHours() === 23),
    });
  }

  async function submitEdit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!editingId) return;
    let startDate: string;
    let endDate: string | undefined;
    if (editForm.allDay) {
      startDate = new Date(`${editForm.date}T00:00:00Z`).toISOString();
      endDate = new Date(`${editForm.date}T23:59:59Z`).toISOString();
    } else {
      startDate = new Date(`${editForm.date}T${editForm.startTime || '00:00'}:00Z`).toISOString();
      endDate = editForm.endTime ? new Date(`${editForm.date}T${editForm.endTime}:00Z`).toISOString() : undefined;
    }
    if (onUpdate) await onUpdate(editingId, { title: editForm.title, description: editForm.description, startDate, endDate });
    setEditingId(null);
  }

  async function removeEvent(id: number) {
    if (!confirm('¿Eliminar evento?')) return;
    if (onDelete) await onDelete(id);
  }

  return (
    <div>
      <div className="calendar-header">
        <button onClick={goPrev}>{'<'}</button>
        <h2>{cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <button onClick={goNext}>{'>'}</button>
      </div>

      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((n) => <div key={n} className="day-name">{n}</div>)}
        {monthDays.map((d, i) => {
          const key = d.toISOString().slice(0,10);
          const isCurrentMonth = d.getMonth() === cursor.getMonth();
          const evs = eventsByDate.get(key) ?? [];
          return (
            <div key={i} className={"calendar-day" + (isCurrentMonth ? '' : ' muted') + (selectedDate === key ? ' selected' : '')} onClick={() => setSelectedDate(key)}>
              <div style={{fontSize: '0.85rem'}}>{d.getDate()}</div>
              {evs.slice(0,3).map((ev: any) => {
                const isAllDay = (() => {
                  try {
                    const s = new Date(ev.startDate);
                    const e = ev.endDate ? new Date(ev.endDate) : null;
                    if (!e) return false;
                    return s.getUTCHours() === 0 && s.getUTCMinutes() === 0 && e.getUTCHours() === 23 && e.getUTCMinutes() === 59;
                  } catch (err) {
                    return false;
                  }
                })();
                return (
                  <div key={ev.id} style={{fontSize: '0.72rem', marginTop:6}} className={isAllDay ? 'all-day-event' : ''}>
                    {ev.title}{isAllDay ? ' (Todo el día)' : ''}
                  </div>
                );
              })}
              {evs.length > 3 && <div style={{fontSize:'0.68rem', opacity:0.7}}>+{evs.length-3} más</div>}
            </div>
          );
        })}
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:20, marginTop:20}}>
        <div className="panel">
          <h3>Eventos del día</h3>
          {!selectedDate ? <div className="empty-state">Selecciona un día</div> : (
            (eventsByDate.get(selectedDate) ?? []).map((ev:any) => (
              <div className="list-row" key={ev.id}>
                <div style={{flex:1}}>
                  {editingId === ev.id ? (
                    <form className="form-panel" onSubmit={submitEdit}>
                      <input value={editForm.title} onChange={(e)=>setEditForm({...editForm,title:e.target.value})} />
                      <input value={editForm.description} onChange={(e)=>setEditForm({...editForm,description:e.target.value})} />
                      <input type="date" value={editForm.date} onChange={(e)=>setEditForm({...editForm,date:e.target.value})} />
                      <label style={{display:'flex',alignItems:'center',gap:8}}>
                        <input type="checkbox" checked={editForm.allDay} onChange={(e)=>setEditForm({...editForm,allDay:e.target.checked})} /> Todo el día
                      </label>
                      {!editForm.allDay && (
                        <>
                          <input type="time" value={editForm.startTime} onChange={(e)=>setEditForm({...editForm,startTime:e.target.value})} />
                          <input type="time" value={editForm.endTime} onChange={(e)=>setEditForm({...editForm,endTime:e.target.value})} />
                        </>
                      )}
                      <div style={{display:'flex',gap:8}}>
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={()=>setEditingId(null)}>Cancelar</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <strong>{ev.title}</strong>
                      <p>{ev.description}</p>
                    </>
                  )}
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  <div>{new Date(ev.startDate).toLocaleTimeString()}</div>
                  {editingId !== ev.id && (
                    <>
                      <button onClick={()=>startEdit(ev)} className="outline-button">Editar</button>
                      <button onClick={()=>removeEvent(ev.id)} className="delete-habit-button">Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <h3>Crear evento</h3>
          <form className="form-panel" onSubmit={submit}>
            <input placeholder="Título" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
            <input placeholder="Descripción" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
            <input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} />
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={form.allDay} onChange={(e)=>setForm({...form,allDay:e.target.checked})} /> Todo el día
            </label>
            {!form.allDay && (
              <>
                <input type="time" value={form.startTime} onChange={(e)=>setForm({...form,startTime:e.target.value})} />
                <input type="time" value={form.endTime} onChange={(e)=>setForm({...form,endTime:e.target.value})} />
              </>
            )}
            <button type="submit">Crear evento</button>
          </form>
        </div>
      </div>
    </div>
  );
}
