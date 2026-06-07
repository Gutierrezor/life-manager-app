export function PanelTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="panel-title">
      <span>{icon}</span>
      <strong>{title}</strong>
    </div>
  );
}
