import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

import type {
  Submission,
  SubmissionStatus,
} from "./VerificationModels";

export function StatusBadge({status}: {status: SubmissionStatus;}) {
  const map = {
    "PENDING": {
      label: "PENDING",
      cls: "av-badge-pending",
      Icon: Clock,
    },

    "VERIFIED": {
      label: "VERIFIED",
      cls: "av-badge-approved",
      Icon: CheckCircle2,
    },

    "REJECTED": {
      label: "REJECTED",
      cls: "av-badge-rejected",
      Icon: XCircle,
    },
  } as const;

  const badge = map[status];
  //console.log(badge);


  return (
    <span className={`av-status-badge ${badge.cls}`}>
      <badge.Icon size={12} strokeWidth={2.4} />
      {badge.label}
    </span>
  );
}

export function TypeTag({type,}: {type: string;}) {
  return (
    <span className="av-type-tag">
      {type}
    </span>
  );
}

export function SubmissionRow({s,onOpen,}: {
  s: Submission;
  onOpen: (s: Submission) => void;
}) {
  
  const initials = s.name.split(" ").map((n) => n[0]).slice(0, 2).join("");

  return (
    <button
      className="av-submission-row"
      onClick={() => onOpen(s)}
    >
      <div className="av-avatar-circle">
        {initials}
      </div>

      <div className="av-row-main">
        <div className="av-row-name-line">
          <p className="av-row-name">
            {s.name}
          </p>

          <TypeTag type={s.role} />
        </div>

        {/* <p className="av-row-meta">
          User ID : {s.userId}
        </p> */}
      </div>

      <div className="av-row-date">
        {new Date(
          s.submittedAt
        ).toLocaleDateString()}
      </div>

      <StatusBadge status = {s.status} />
      

      <ChevronRight
        size={16}
        className="av-row-chevron"
      />
    </button>
    
  );
}