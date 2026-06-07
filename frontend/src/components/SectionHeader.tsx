import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  buttonText,
  onClick,
}: {
  title: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <section className="section-header">
      <h1>{title}</h1>
      <button onClick={onClick}>{buttonText}</button>
    </section>
  );
}
