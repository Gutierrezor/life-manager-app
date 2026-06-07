export function StatCard({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: 'green' | 'red' | 'yellow' | 'purple';
}) {
  return (
    <article className={`stat-card ${color}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
