import { useState } from "react";
import {
  X,
  User,
  FileText,
  BadgeCheck,
  XCircle,
} from "lucide-react";

import type { Submission } from "./VerificationModels";
import { StatusBadge, TypeTag } from "./Shared";

interface Props {
  submission: Submission | null;
  onClose: () => void;

  onDecide: (
    id: number,
    status: "VERIFIED" | "REJECTED",
    reason?: string
  ) => void;
}

export default function ReviewDrawer({
  submission,
  onClose,
  onDecide,
}: Props) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!submission) return null;

  const s = submission;

  const decided = s.status !== "PENDING";

  const initials = s.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

    

  return (
    <div
      className="av-drawer-overlay"
      onClick={onClose}
    >
      <div
        className="av-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="av-drawer-header">
          <div>
            {/* <p className="av-mono av-drawer-id">
              User ID: {s.userId}
            </p> */}

            <h3 className="av-drawer-title">
              Review Submission
            </h3>
          </div>

          <button
            className="av-icon-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="av-drawer-body">
          <div>
            <p className="av-eyebrow">
              Submitted By
            </p>

            <div className="av-drawer-user-card">
              <div className="av-avatar-circle">
                {initials}
              </div>

              <div className="av-drawer-user-info">
                <div className="av-row-name-line">
                  <p className="av-row-name">
                    {s.name}
                  </p>

                  <TypeTag type={s.role} />
                </div>

                {/* <p className="av-row-meta">
                  User ID: {s.userId}
                </p> */}
              </div>

              <User size={16} />
            </div>

            <p className="av-drawer-submitted">
              Submitted on{" "}
              {new Date(
                s.submittedAt
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="av-eyebrow">Uploaded Document</p>

            <div className="av-doc-grid">
              <a
                  href={`http://localhost:8080${s.documentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="av-doc-thumb"
                >
                  <FileText size={26} strokeWidth={1.6} />
                  <p>{s.documentLabel}</p>
                <span>Click to View PDF</span>
              </a>
            </div>

            <p className="av-doc-hint">
              Open the document and verify that it is valid before taking an action.
            </p>
          </div>

          {decided && (
            
            <div>
              
              <p className="av-eyebrow">
                Decision
              </p>
              

              <div
                className={`av-decision-card ${
                  s.status === "VERIFIED"
                    ? "is-approved"
                    : "is-rejected"
                }`}
              >
                <div className="av-decision-top">
                  <StatusBadge
                    status={s.status}
                  />
                </div>

                {s.status === "REJECTED" && s.reason && (
                  <p className="av-decision-note" >
                    {s.reason}
                  </p>
                )}
              </div>
            </div>
          )}

          {!decided && rejecting && (
            <div>
              <p className="av-eyebrow">
                Reason For Rejection
              </p>

              <textarea
                className="av-reason-box"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                rows={3}
                placeholder="Enter rejection reason..."
                autoFocus
              />
            </div>
          )}
        </div>

        {!decided && (
          <div className="av-drawer-actions">
            {!rejecting ? (
              <>
                <button
                  className="av-btn av-btn-reject"
                  onClick={() =>
                    setRejecting(true)
                  }
                >
                  <XCircle size={16} />
                  Reject
                </button>

                <button
                  className="av-btn av-btn-approve"
                  onClick={() =>
                    onDecide(
                      Number(s.userId),
                      "VERIFIED"
                    )
                  }
                >
                  <BadgeCheck size={16} />
                  Approve
                </button>
              </>
            ) : (
              <>
                <button
                  className="av-btn av-btn-cancel"
                  onClick={() => {
                    setRejecting(false);
                    setReason("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="av-btn av-btn-confirm-reject"
                  disabled={
                    !reason.trim()
                  }
                  onClick={() =>
                    onDecide(
                      Number(s.userId),
                      "REJECTED",
                      reason.trim()
                    )
                  }
                >
                  Confirm Rejection
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}