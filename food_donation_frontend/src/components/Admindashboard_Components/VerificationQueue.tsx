// components/AdminDashboard_Components/VerificationQueue.tsx
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Submission } from './VerificationModels';
import { SubmissionRow } from './Shared';

interface Props {
  
  submissions: Submission[];
  onOpen: (s: Submission) => void;
}

type FilterKey = 'PENDING' | 'REJECTED' | 'VERIFIED';

export default function VerificationQueue({ submissions, onOpen }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('PENDING');

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'PENDING',  label: 'Pending'  },
    { key: 'REJECTED', label: 'Rejected' },
    
  ];

  const filtered = useMemo(() => {

  const q = query.toLowerCase();

  return submissions.filter((s) => {

    const matchesFilter =
      s.status === filter;

    const matchesQuery =
      s.name.toLowerCase().includes(q) ||
      s.userId.toString().includes(q);

    return matchesFilter && matchesQuery;
  });

}, [submissions, query, filter]);

  return (
    <div className="av-section page-enter">
      <div className="av-toolbar">
        <div className="av-filter-group">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`av-filter-chip ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="av-search-box">
          <Search size={15} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID…"
          />
        </div>
      </div>

      <div className="av-row-list">
        {filtered.length === 0 && <div className="av-empty">No submissions match this view.</div>}
        {filtered.map((s) => (
          <SubmissionRow key={s.userId} s={s} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}