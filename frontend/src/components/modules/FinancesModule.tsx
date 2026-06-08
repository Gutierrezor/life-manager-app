import React, { useState } from 'react';
import { api, getApiErrorMessage } from '../../api/api';

interface FinancesModuleProps {
  transactions: any[];
  finCategories: any[];
  finSummary: any;
  formatAmount: (v: any) => string;
  reload: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function FinancesModule({ transactions, finCategories, finSummary, formatAmount, reload, showToast }: FinancesModuleProps) {
  const [txForm, setTxForm] = useState({ type: 'EXPENSE', amount: '', description: '', categoryId: '' });
  const [catForm, setCatForm] = useState({ name: '', type: 'EXPENSE', color: '#ef4444' });
  const [filterType, setFilterType] = useState('');

  async function createTx(e?: React.FormEvent) {
    e?.preventDefault();
    if (!txForm.amount) return;
    try {
      await api.post('/finances/transactions', { type: txForm.type, amount: Number(txForm.amount), description: txForm.description || undefined, transactionDate: new Date().toISOString(), categoryId: txForm.categoryId ? Number(txForm.categoryId) : undefined });
      setTxForm({ type: 'EXPENSE', amount: '', description: '', categoryId: '' });
      await reload();
      showToast('Transacción registrada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function deleteTx(id: number) {
    if (!confirm('¿Eliminar esta transacción?')) return;
    try {
      await api.delete(`/finances/transactions/${id}`);
      await reload();
      showToast('Transacción eliminada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  async function createCat(e?: React.FormEvent) {
    e?.preventDefault();
    if (!catForm.name.trim()) return;
    try {
      await api.post('/finances/categories', { name: catForm.name, type: catForm.type, color: catForm.color });
      setCatForm({ name: '', type: 'EXPENSE', color: '#ef4444' });
      await reload();
      showToast('Categoría creada', 'success');
    } catch (err) { showToast(getApiErrorMessage(err), 'error'); }
  }

  const filtered = filterType ? transactions.filter((t: any) => t.type === filterType) : transactions;
  const incomeCategories = finCategories.filter((c: any) => c.type === 'INCOME');
  const expenseCategories = finCategories.filter((c: any) => c.type === 'EXPENSE');

  const balance = finSummary?.balance ?? 0;
  const totalIncome = finSummary?.totalIncome ?? 0;
  const totalExpense = finSummary?.totalExpense ?? 0;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="module-layout">
      <div className="module-sidebar">
        <div className="form-card">
          <h3>Nueva transacción</h3>
          <form onSubmit={createTx}>
            <div className="field">
              <label>Tipo</label>
              <select value={txForm.type} onChange={(e) => setTxForm({ ...txForm, type: e.target.value, categoryId: '' })}>
                <option value="EXPENSE">Gasto</option>
                <option value="INCOME">Ingreso</option>
              </select>
            </div>
            <div className="field">
              <label>Monto</label>
              <input type="number" placeholder="0" min="0" step="any" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} />
            </div>
            <div className="field">
              <label>Descripción</label>
              <input placeholder="Ej: Mercado, Sueldo…" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} />
            </div>
            <div className="field">
              <label>Categoría</label>
              <select value={txForm.categoryId} onChange={(e) => setTxForm({ ...txForm, categoryId: e.target.value })}>
                <option value="">Sin categoría</option>
                {(txForm.type === 'INCOME' ? incomeCategories : expenseCategories).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">Registrar</button>
          </form>
        </div>

        <div className="form-card">
          <h3>Nueva categoría</h3>
          <form onSubmit={createCat}>
            <div className="field">
              <label>Tipo</label>
              <select value={catForm.type} onChange={(e) => setCatForm({ ...catForm, type: e.target.value })}>
                <option value="EXPENSE">Gasto</option>
                <option value="INCOME">Ingreso</option>
              </select>
            </div>
            <div className="field">
              <label>Nombre</label>
              <input placeholder="Ej: Alimentación" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
            </div>
            <div className="field field-row">
              <label>Color</label>
              <input type="color" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} />
            </div>
            <button type="submit" className="btn-secondary">Crear categoría</button>
          </form>
          <div className="chip-list">
            {finCategories.map((c: any) => (
              <span className="chip" key={c.id} style={{ '--chip-color': c.color ?? '#6366f1' } as any}>
                <span className="chip-dot" />
                {c.name}
                <span className="chip-type">{c.type === 'INCOME' ? '↑' : '↓'}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="module-content">
        {/* Summary cards */}
        <div className="fin-cards-row">
          <div className={`fin-card ${balance >= 0 ? 'positive' : 'negative'}`}>
            <span className="fin-card-label">Balance</span>
            <strong className="fin-card-value">{formatAmount(balance)}</strong>
            {totalIncome > 0 && (
              <div className="savings-bar">
                <div className="savings-fill" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }} />
              </div>
            )}
            <span className="fin-card-sub">{savingsRate > 0 ? `${savingsRate}% tasa de ahorro` : 'Sin ingresos registrados'}</span>
          </div>
          <div className="fin-card income">
            <span className="fin-card-label">Ingresos totales</span>
            <strong className="fin-card-value">{formatAmount(totalIncome)}</strong>
            <span className="fin-card-sub">{transactions.filter(t => t.type === 'INCOME').length} transacciones</span>
          </div>
          <div className="fin-card expense">
            <span className="fin-card-label">Gastos totales</span>
            <strong className="fin-card-value">{formatAmount(totalExpense)}</strong>
            <span className="fin-card-sub">{transactions.filter(t => t.type === 'EXPENSE').length} transacciones</span>
          </div>
        </div>

        {/* Transactions list */}
        <div className="content-toolbar" style={{ marginTop: 16 }}>
          <h3 style={{ margin: 0 }}>Movimientos</h3>
          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Todos</option>
            <option value="INCOME">Solo ingresos</option>
            <option value="EXPENSE">Solo gastos</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <span>◈</span>
            <p>Sin movimientos registrados</p>
          </div>
        ) : (
          <div className="tx-list">
            {filtered.map((t: any) => {
              const cat = finCategories.find((c: any) => c.id === t.categoryId);
              return (
                <div className={`tx-card ${t.type === 'INCOME' ? 'income' : 'expense'}`} key={t.id}>
                  <div className="tx-card-icon" style={{ background: cat?.color ?? (t.type === 'INCOME' ? '#4ade80' : '#fb7185') + '22' }}>
                    {t.type === 'INCOME' ? '↑' : '↓'}
                  </div>
                  <div className="tx-card-body">
                    <strong>{t.description || 'Transacción'}</strong>
                    <span className="tx-cat">{cat?.name ?? t.type === 'INCOME' ? 'Ingreso' : 'Gasto'}</span>
                    <span className="tx-date">{new Date(t.transactionDate).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                  </div>
                  <div className="tx-card-right">
                    <strong className={`tx-amount ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                      {t.type === 'INCOME' ? '+' : '-'}{formatAmount(t.amount)}
                    </strong>
                    <button className="btn-danger btn-sm" onClick={() => deleteTx(t.id)}>×</button>
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
