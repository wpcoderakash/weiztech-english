"use client";

import { useMemo, useState, useTransition } from "react";
import type { ReactNode } from "react";

import styles from "../../admin.module.css";

import { reorderRecipients } from "./actions";

export interface Recipient {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  is_primary: boolean;
}

/**
 * Drag & drop ordering. HTML5 DnD keeps it dependency-free; the new order is
 * persisted immediately (server action), and the list is optimistic so the
 * drag feels instant.
 */
export function RecipientList({
  recipients,
  rows,
}: {
  recipients: Recipient[];
  /* Server-rendered row content, parallel to `recipients`. Elements cross the
     boundary fine — a render prop (function) does not. */
  rows: ReactNode[];
}) {
  const [items, setItems] = useState(recipients);
  const rowById = useMemo(() => {
    const map = new Map<string, ReactNode>();
    recipients.forEach((r, i) => map.set(r.id, rows[i]));
    return map;
  }, [recipients, rows]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const next = [...items];
    const from = next.findIndex((r) => r.id === dragId);
    const to = next.findIndex((r) => r.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = next.splice(from, 1);
    if (moved) next.splice(to, 0, moved);
    setItems(next);
    setDragId(null);
    startTransition(() => {
      void reorderRecipients(next.map((r) => r.id));
    });
  };

  return (
    <div className="rcp-list">
      {items.map((r) => (
        <div
          key={r.id}
          className={`rcp-row ${dragId === r.id ? "rcp-dragging" : ""}`}
          draggable
          onDragStart={() => setDragId(r.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => onDrop(r.id)}
          onDragEnd={() => setDragId(null)}
        >
          <span className="rcp-handle" title="Drag to reorder">
            ⠿
          </span>
          {rowById.get(r.id)}
        </div>
      ))}
      {pending ? <span className={styles.statusRead}>saving order…</span> : null}
    </div>
  );
}
