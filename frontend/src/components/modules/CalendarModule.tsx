
import { api, getApiErrorMessage } from '../../api/api';
import CalendarView from '../CalendarView';

interface CalendarModuleProps {
  events: any[];
  reload: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function CalendarModule({ events, reload, showToast }: CalendarModuleProps) {
  return (
    <div className="calendar-module">
      <CalendarView
        events={events}
        onCreate={async (data) => {
          try {
            await api.post('/calendar-events', data);
            await reload();
            showToast('Evento creado', 'success');
          } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
        }}
        onUpdate={async (id, updates) => {
          try {
            await api.patch(`/calendar-events/${id}`, updates);
            await reload();
            showToast('Evento actualizado', 'success');
          } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
        }}
        onDelete={async (id) => {
          try {
            await api.delete(`/calendar-events/${id}`);
            await reload();
            showToast('Evento eliminado', 'success');
          } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
        }}
      />
    </div>
  );
}
