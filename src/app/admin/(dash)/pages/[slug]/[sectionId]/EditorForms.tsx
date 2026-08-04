"use client";

import { useActionState, type ReactNode } from "react";

import { EDITOR_IDLE, type EditorState } from "../../editor-state";

/**
 * Feedback for the editor's actions.
 *
 * Every button used to be a bare form submit returning nothing: the click had
 * no visible effect, the round trip to the server took a second or two, and
 * whether it had worked was unknowable. Each button now disables itself and
 * says what it is doing, then reports the outcome in words.
 */
type BoundAction = (prev: EditorState, formData: FormData) => Promise<EditorState>;

function Result({ state }: { state: EditorState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={state.ok ? "ed-note ed-note-ok" : "ed-note ed-note-bad"}
    >
      <span aria-hidden="true">{state.ok ? "✓" : "✕"}</span> {state.message}
    </p>
  );
}

/** The main editor form: fields are server-rendered and passed through. */
export function SaveDraftForm({
  action,
  children,
  className,
  buttonClassName,
}: {
  action: BoundAction;
  children: ReactNode;
  className: string;
  buttonClassName: string;
}) {
  const [state, formAction, pending] = useActionState(action, EDITOR_IDLE);
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="ed-actions">
        <button
          type="submit"
          className={buttonClassName}
          style={{ border: 0 }}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Saving…" : "Save draft"}
        </button>
        <Result state={state} />
      </div>
    </form>
  );
}

/**
 * Publish + Discard together.
 *
 * They must live in ONE always-mounted component: publishing clears the draft,
 * so the server re-renders without the buttons — and a result rendered inside
 * a button's own form would be unmounted along with it, flashing the
 * confirmation away before it could be read. The buttons come and go; this
 * wrapper (and its message) stays.
 */
export function DraftActions({
  hasDraft,
  publish,
  discard,
  publishClassName,
  discardClassName,
}: {
  hasDraft: boolean;
  publish: BoundAction;
  discard: BoundAction;
  publishClassName: string;
  discardClassName: string;
}) {
  const [pubState, pubAction, pubPending] = useActionState(publish, EDITOR_IDLE);
  const [disState, disAction, disPending] = useActionState(discard, EDITOR_IDLE);
  /* Whichever finished last is the one worth showing. */
  const latest = pubState.at >= disState.at ? pubState : disState;

  return (
    <span className="ed-inline">
      {hasDraft ? (
        <>
          <form action={pubAction}>
            <button
              type="submit"
              className={publishClassName}
              style={{ border: 0 }}
              disabled={pubPending || disPending}
              aria-busy={pubPending}
            >
              {pubPending ? "Publishing…" : "Publish"}
            </button>
          </form>
          <form
            action={disAction}
            onSubmit={(event) => {
              if (!window.confirm("Discard this draft? Your unpublished changes will be lost."))
                event.preventDefault();
            }}
          >
            <button
              type="submit"
              className={discardClassName}
              disabled={pubPending || disPending}
              aria-busy={disPending}
            >
              {disPending ? "Discarding…" : "Discard draft"}
            </button>
          </form>
        </>
      ) : null}
      <Result state={latest} />
    </span>
  );
}

/** Restore — a single button with the same feedback. */
export function ActionButton({
  action,
  label,
  pendingLabel,
  className,
  danger = false,
  confirm,
}: {
  action: BoundAction;
  label: string;
  pendingLabel: string;
  className: string;
  danger?: boolean;
  confirm?: string;
}) {
  const [state, formAction, pending] = useActionState(action, EDITOR_IDLE);
  return (
    <form
      action={formAction}
      className="ed-inline"
      onSubmit={(event) => {
        /* Discard throws away unpublished work — make it deliberate. */
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
    >
      <button
        type="submit"
        className={className}
        style={danger ? { border: 0 } : undefined}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? pendingLabel : label}
      </button>
      <Result state={state} />
    </form>
  );
}
