import type { ReactNode } from 'react';

export function ListRow({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="list-row">
      <div>
        <strong>{title}</strong>
        <p>{subtitle}</p>
      </div>
      {actions ? <div className="row-actions">{actions}</div> : null}
    </div>
  );
}
