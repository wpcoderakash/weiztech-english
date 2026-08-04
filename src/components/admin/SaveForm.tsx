"use client";

import { useActionState, type ReactNode } from "react";

import { EDITOR_IDLE, type EditorState } from "@/app/admin/(dash)/pages/editor-state";

/**
 * A save form that says what it is doing.
 *
 * Admin forms were plain submits returning nothing: the click looked inert,
 * the round trip took a second or two, and there was no way to tell success
 * from a silent permission failure. This disables the button, names the
 * in-flight state, and reports the outcome in words.
 */
export function SaveForm({
  action,
  children,
  label,
  pendingLabel,
  className,
  buttonClassName,
  buttonStyle,
}: {
  action: (prev: EditorState, formData: FormData) => Promise<EditorState>;
  children: ReactNode;
  label: string;
  pendingLabel: string;
  className?: string;
  buttonClassName: string;
  buttonStyle?: React.CSSProperties;
}) {
  const [state, formAction, pending] = useActionState(action, EDITOR_IDLE);
  return (
    <form action={formAction} {...(className ? { className } : {})}>
      {children}
      <div className="ed-actions">
        <button
          type="submit"
          className={buttonClassName}
          style={buttonStyle}
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? pendingLabel : label}
        </button>
        {state.message ? (
          <p
            role="status"
            aria-live="polite"
            className={state.ok ? "ed-note ed-note-ok" : "ed-note ed-note-bad"}
          >
            <span aria-hidden="true">{state.ok ? "✓" : "✕"}</span> {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
