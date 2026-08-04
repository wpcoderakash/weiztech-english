/**
 * Result shape shared by the section editor's actions and its buttons.
 *
 * It lives outside actions.ts because a "use server" module may only export
 * async functions — a plain constant there breaks the build.
 */
export interface EditorState {
  ok: boolean;
  message: string | null;
  /** Bumped on every result so an identical message still re-announces. */
  at: number;
}

export const EDITOR_IDLE: EditorState = { ok: false, message: null, at: 0 };
