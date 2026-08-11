// components/RecipientDashboard_Components/Shared.tsx
import type { ReactNode } from 'react';

export type PillTone = 'amber' | 'green' | 'red' | 'blue' | 'neutral';

export function StatusPill({ label, tone, icon }: { label: string; tone: PillTone; icon?: ReactNode }) {
  return (
    <span className={`rd-pill rd-pill-${tone}`}>
      {icon}
      {label}
    </span>
  );
}

export function EmptyState({ title, hint, action }: { title: string; hint: string; action?: ReactNode }) {
  return (
    <div className="rd-empty">
      <p className="rd-empty-title">{title}</p>
      <p className="rd-empty-hint">{hint}</p>
      {action}
    </div>
  );
}